const express = require("express");
const multer = require("multer");
const {
	uploadPdfToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const Magazine = require("../models/Magazine");

const router = express.Router();

// Configure multer for file upload
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 50 * 1024 * 1024, // 50MB limit for PDFs
	},
	fileFilter: (req, file, cb) => {
		if (file.fieldname === "pdf") {
			// Accept only PDF files
			if (file.mimetype === "application/pdf") {
				cb(null, true);
			} else {
				cb(
					new Error("Only PDF files are allowed for magazine upload"),
					false
				);
			}
		} else if (file.fieldname === "coverImage") {
			// Accept only image files for cover
			if (file.mimetype.startsWith("image/")) {
				cb(null, true);
			} else {
				cb(
					new Error("Only image files are allowed for cover image"),
					false
				);
			}
		} else {
			cb(new Error("Invalid field name"), false);
		}
	},
});

// Get all magazines (public route)
router.get("/", async (req, res) => {
	try {
		console.log("📚 Fetching all magazines...");

		const { year, month, page = 1, limit = 12, search } = req.query;
		const skip = (page - 1) * limit;

		// Build filter
		const filter = { isActive: true };
		if (year) filter.year = parseInt(year);
		if (month) filter.month = month;

		let query = Magazine.find(filter);

		// Add search functionality
		if (search) {
			query = query.find({
				$text: { $search: search },
			});
		}

		// Execute query with pagination
		const magazines = await query
			.sort({ year: -1, publishedDate: -1 })
			.skip(skip)
			.limit(parseInt(limit))
			.select("-pdfPublicId -coverImagePublicId");

		// Get total count for pagination
		const total = await Magazine.countDocuments(filter);

		console.log(`✅ Found ${magazines.length} magazines`);

		res.json({
			magazines,
			pagination: {
				current: parseInt(page),
				total: Math.ceil(total / limit),
				hasNext: skip + magazines.length < total,
				hasPrev: page > 1,
			},
			total,
		});
	} catch (error) {
		console.error("❌ Error fetching magazines:", error);
		res.status(500).json({ error: "Failed to fetch magazines" });
	}
});

// Get magazines grouped by year (public route)
router.get("/by-year", async (req, res) => {
	try {
		console.log("📅 Fetching magazines grouped by year...");

		const magazines = await Magazine.find({ isActive: true })
			.sort({ year: -1, publishedDate: -1 })
			.select(
				"title year month description pdfUrl coverImageUrl publishedDate views downloadCount"
			);

		// Group by year
		const groupedByYear = magazines.reduce((acc, magazine) => {
			const year = magazine.year;
			if (!acc[year]) {
				acc[year] = {};
			}
			acc[year][magazine.month] = {
				...magazine.toObject(),
				id: magazine._id,
			};
			return acc;
		}, {});

		console.log(
			`✅ Grouped magazines for ${
				Object.keys(groupedByYear).length
			} years`
		);

		res.json(groupedByYear);
	} catch (error) {
		console.error("❌ Error fetching magazines by year:", error);
		res.status(500).json({ error: "Failed to fetch magazines" });
	}
});

// Get single magazine by ID (public route)
router.get("/:id", async (req, res) => {
	try {
		console.log(`📖 Fetching magazine with ID: ${req.params.id}`);

		const magazine = await Magazine.findById(req.params.id).select(
			"-pdfPublicId -coverImagePublicId"
		);

		if (!magazine || !magazine.isActive) {
			return res.status(404).json({ error: "Magazine not found" });
		}

		console.log(`✅ Found magazine: ${magazine.title}`);
		res.json(magazine);
	} catch (error) {
		console.error("❌ Error fetching magazine:", error);
		res.status(500).json({ error: "Failed to fetch magazine" });
	}
});

// Track magazine view (public route)
router.post("/:id/view", async (req, res) => {
	try {
		const magazine = await Magazine.findById(req.params.id);

		if (!magazine || !magazine.isActive) {
			return res.status(404).json({ error: "Magazine not found" });
		}

		await magazine.incrementViews();
		console.log(`👀 Incremented views for magazine: ${magazine.title}`);

		res.json({ message: "View tracked successfully" });
	} catch (error) {
		console.error("❌ Error tracking view:", error);
		res.status(500).json({ error: "Failed to track view" });
	}
});

// Track magazine download (public route)
router.post("/:id/download", async (req, res) => {
	try {
		const magazine = await Magazine.findById(req.params.id);

		if (!magazine || !magazine.isActive) {
			return res.status(404).json({ error: "Magazine not found" });
		}

		await magazine.incrementDownloads();
		console.log(`⬇️ Incremented downloads for magazine: ${magazine.title}`);

		res.json({ message: "Download tracked successfully" });
	} catch (error) {
		console.error("❌ Error tracking download:", error);
		res.status(500).json({ error: "Failed to track download" });
	}
});

// Admin routes (require authentication)

// Get all magazines including inactive ones (admin only)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
	try {
		console.log("🔒 Admin fetching all magazines...");

		const { page = 1, limit = 12, search, year, isActive } = req.query;
		const skip = (page - 1) * limit;

		// Build filter
		const filter = {};
		if (year) filter.year = parseInt(year);
		if (isActive !== undefined) filter.isActive = isActive === "true";

		let query = Magazine.find(filter);

		// Add search functionality
		if (search) {
			query = query.find({
				$text: { $search: search },
			});
		}

		// Execute query with pagination
		const magazines = await query
			.sort({ year: -1, publishedDate: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count for pagination
		const total = await Magazine.countDocuments(filter);

		console.log(`✅ Admin found ${magazines.length} magazines`);

		res.json({
			magazines,
			pagination: {
				current: parseInt(page),
				total: Math.ceil(total / limit),
				hasNext: skip + magazines.length < total,
				hasPrev: page > 1,
			},
			total,
		});
	} catch (error) {
		console.error("❌ Error fetching magazines for admin:", error);
		res.status(500).json({ error: "Failed to fetch magazines" });
	}
});

// Create new magazine (admin only)
router.post(
	"/",
	authenticateToken,
	requireAdmin,
	upload.fields([
		{ name: "pdf", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			console.log("📝 Creating new magazine...");
			console.log("📋 Request body:", req.body);
			console.log(
				"📁 Files uploaded:",
				req.files ? Object.keys(req.files) : "none"
			);

			const { title, year, month, description } = req.body;

			// Validate required fields
			if (!title || !year || !month || !description) {
				return res.status(400).json({
					error: "Title, year, month, and description are required",
				});
			}

			// Check if PDF file is uploaded
			if (!req.files || !req.files.pdf || !req.files.pdf[0]) {
				return res.status(400).json({ error: "PDF file is required" });
			}

			// Check if magazine already exists for this year-month
			const existingMagazine = await Magazine.findOne({
				year: parseInt(year),
				month,
			});

			if (existingMagazine) {
				return res.status(400).json({
					error: `Magazine for ${month} ${year} already exists`,
				});
			}

			console.log("☁️ Uploading PDF to Cloudinary...");
			// Upload PDF to Cloudinary
			const pdfFile = req.files.pdf[0];
			const pdfUploadResult = await uploadPdfToCloudinary(
				pdfFile.buffer,
				{
					folder: "magazines/pdfs",
					public_id: `magazine_${year}_${month.toLowerCase()}.pdf`,
					resource_type: "raw",
				}
			);

			console.log("✅ PDF uploaded successfully");

			let coverImageUrl = null;
			let coverImagePublicId = null;

			// Upload cover image if provided
			if (req.files.coverImage && req.files.coverImage[0]) {
				console.log("🖼️ Uploading cover image to Cloudinary...");

				const coverFile = req.files.coverImage[0];
				const coverUploadResult = await uploadPdfToCloudinary(
					coverFile.buffer,
					{
						folder: "magazines/covers",
						public_id: `magazine_cover_${year}_${month.toLowerCase()}`,
						resource_type: "image",
					}
				);

				coverImageUrl = coverUploadResult.secure_url;
				coverImagePublicId = coverUploadResult.public_id;

				console.log("✅ Cover image uploaded successfully");
			}

			// Create magazine in database
			const magazine = new Magazine({
				title,
				year: parseInt(year),
				month,
				description,
				pdfUrl: pdfUploadResult.secure_url,
				pdfPublicId: pdfUploadResult.public_id,
				coverImageUrl,
				coverImagePublicId,
				isActive: req.body.isActive !== "false",
			});

			await magazine.save();

			console.log(`✅ Magazine created successfully: ${magazine.title}`);

			res.status(201).json({
				message: "Magazine created successfully",
				magazine: {
					...magazine.toObject(),
					pdfPublicId: undefined,
					coverImagePublicId: undefined,
				},
			});
		} catch (error) {
			console.error("❌ Error creating magazine:", error);

			// Clean up uploaded files if database save fails
			if (error.code === 11000) {
				return res.status(400).json({
					error: "Magazine for this year and month already exists",
				});
			}

			res.status(500).json({ error: "Failed to create magazine" });
		}
	}
);

// Update magazine (admin only)
router.put(
	"/:id",
	authenticateToken,
	requireAdmin,
	upload.fields([
		{ name: "pdf", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			console.log(`📝 Updating magazine with ID: ${req.params.id}`);

			const magazine = await Magazine.findById(req.params.id);

			if (!magazine) {
				return res.status(404).json({ error: "Magazine not found" });
			}

			const { title, year, month, description, isActive } = req.body;

			// Update basic fields
			if (title) magazine.title = title;
			if (year) magazine.year = parseInt(year);
			if (month) magazine.month = month;
			if (description) magazine.description = description;
			if (isActive !== undefined)
				magazine.isActive = isActive !== "false";

			// Handle PDF update
			if (req.files && req.files.pdf && req.files.pdf[0]) {
				console.log("☁️ Updating PDF...");

				// Delete old PDF
				if (magazine.pdfPublicId) {
					await deleteFromCloudinary(magazine.pdfPublicId, "raw");
				}
				// Upload new PDF
				const pdfFile = req.files.pdf[0];
				const pdfUploadResult = await uploadPdfToCloudinary(
					pdfFile.buffer,
					{
						folder: "magazines/pdfs",
						public_id: `magazine_${
							magazine.year
						}_${magazine.month.toLowerCase()}.pdf`,
						resource_type: "raw",
					}
				);

				magazine.pdfUrl = pdfUploadResult.secure_url;
				magazine.pdfPublicId = pdfUploadResult.public_id;

				console.log("✅ PDF updated successfully");
			}

			// Handle cover image update
			if (req.files && req.files.coverImage && req.files.coverImage[0]) {
				console.log("🖼️ Updating cover image...");

				// Delete old cover image
				if (magazine.coverImagePublicId) {
					await deleteFromCloudinary(
						magazine.coverImagePublicId,
						"image"
					);
				}

				// Upload new cover image
				const coverFile = req.files.coverImage[0];
				const coverUploadResult = await uploadPdfToCloudinary(
					coverFile.buffer,
					{
						folder: "magazines/covers",
						public_id: `magazine_cover_${
							magazine.year
						}_${magazine.month.toLowerCase()}`,
						resource_type: "image",
					}
				);

				magazine.coverImageUrl = coverUploadResult.secure_url;
				magazine.coverImagePublicId = coverUploadResult.public_id;

				console.log("✅ Cover image updated successfully");
			}

			await magazine.save();

			console.log(`✅ Magazine updated successfully: ${magazine.title}`);

			res.json({
				message: "Magazine updated successfully",
				magazine: {
					...magazine.toObject(),
					pdfPublicId: undefined,
					coverImagePublicId: undefined,
				},
			});
		} catch (error) {
			console.error("❌ Error updating magazine:", error);

			if (error.code === 11000) {
				return res.status(400).json({
					error: "Magazine for this year and month already exists",
				});
			}

			res.status(500).json({ error: "Failed to update magazine" });
		}
	}
);

// Delete magazine (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		console.log(`🗑️ Deleting magazine with ID: ${req.params.id}`);

		const magazine = await Magazine.findById(req.params.id);

		if (!magazine) {
			return res.status(404).json({ error: "Magazine not found" });
		}

		// Delete files from Cloudinary
		if (magazine.pdfPublicId) {
			console.log("☁️ Deleting PDF from Cloudinary...");
			await deleteFromCloudinary(magazine.pdfPublicId, "raw");
		}

		if (magazine.coverImagePublicId) {
			console.log("☁️ Deleting cover image from Cloudinary...");
			await deleteFromCloudinary(magazine.coverImagePublicId, "image");
		}

		// Delete from database
		await Magazine.findByIdAndDelete(req.params.id);

		console.log(`✅ Magazine deleted successfully: ${magazine.title}`);

		res.json({ message: "Magazine deleted successfully" });
	} catch (error) {
		console.error("❌ Error deleting magazine:", error);
		res.status(500).json({ error: "Failed to delete magazine" });
	}
});

// Toggle magazine active status (admin only)
router.patch(
	"/:id/toggle-active",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			console.log(
				`🔄 Toggling active status for magazine ID: ${req.params.id}`
			);

			const magazine = await Magazine.findById(req.params.id);

			if (!magazine) {
				return res.status(404).json({ error: "Magazine not found" });
			}

			magazine.isActive = !magazine.isActive;
			await magazine.save();

			console.log(
				`✅ Magazine active status toggled: ${magazine.isActive}`
			);

			res.json({
				message: `Magazine ${
					magazine.isActive ? "activated" : "deactivated"
				} successfully`,
				magazine: {
					...magazine.toObject(),
					pdfPublicId: undefined,
					coverImagePublicId: undefined,
				},
			});
		} catch (error) {
			console.error("❌ Error toggling magazine status:", error);
			res.status(500).json({ error: "Failed to toggle magazine status" });
		}
	}
);

module.exports = router;
