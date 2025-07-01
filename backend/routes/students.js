const express = require("express");
const multer = require("multer");
const {
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const Student = require("../models/Student");

const router = express.Router();

// Configure multer for file upload
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 200 * 1024, // 200KB limit for photos
	},
	fileFilter: (req, file, cb) => {
		if (file.fieldname === "photo") {
			// Accept only image files
			if (file.mimetype.startsWith("image/")) {
				cb(null, true);
			} else {
				cb(new Error("Only image files are allowed"), false);
			}
		} else {
			cb(new Error("Invalid field name"), false);
		}
	},
});

// Public route - Submit student registration
router.post(
	"/register",
	upload.fields([{ name: "photo", maxCount: 1 }]),
	async (req, res) => {
		try {
			console.log("📝 Processing student registration...");
			console.log("📋 Registration data:", req.body);

			const {
				studentName,
				addressLine1,
				addressLine2,
				addressLine3,
				phoneNumber,
				gender,
				age,
				dateOfBirth,
				parentsName,
				parentsNumber,
				courses,
				registrationDate,
			} = req.body;

			// Validate required fields
			if (
				!studentName ||
				!addressLine1 ||
				!phoneNumber ||
				!gender ||
				!age ||
				!dateOfBirth ||
				!parentsName ||
				!parentsNumber ||
				!registrationDate
			) {
				return res.status(400).json({
					error: "All required fields must be filled",
				});
			}

			// Parse courses (could be a string or array)
			let selectedCourses = [];
			if (courses) {
				if (typeof courses === "string") {
					selectedCourses = courses
						.split(",")
						.map((c) => c.trim())
						.filter((c) => c);
				} else if (Array.isArray(courses)) {
					selectedCourses = courses;
				}
			}

			if (selectedCourses.length === 0) {
				return res.status(400).json({
					error: "At least one course must be selected",
				});
			}

			let photoUrl = null;
			let photoPublicId = null;

			// Upload photo if provided
			if (req.files && req.files.photo && req.files.photo[0]) {
				console.log("📸 Uploading student photo...");

				const photoFile = req.files.photo[0];
				const photoUploadResult = await uploadToCloudinary(
					photoFile.buffer,
					{
						folder: "students/photos",
						transformation: [
							{
								width: 300,
								height: 400,
								crop: "fill",
								quality: "auto",
							},
						],
					}
				);

				photoUrl = photoUploadResult.url;
				photoPublicId = photoUploadResult.publicId;

				console.log("✅ Photo uploaded successfully");
			}

			// Create student registration
			const student = new Student({
				studentName,
				address: {
					line1: addressLine1,
					line2: addressLine2 || "",
					line3: addressLine3 || "",
				},
				phoneNumber,
				gender,
				age: parseInt(age),
				dateOfBirth: new Date(dateOfBirth),
				parentsName,
				parentsNumber,
				courses: selectedCourses,
				photoUrl,
				photoPublicId,
				registrationDate: new Date(registrationDate),
			});

			await student.save();

			console.log(
				`✅ Student registration created: ${student.formNo} - ${student.studentName}`
			);

			res.status(201).json({
				message: "Registration submitted successfully",
				formNo: student.formNo,
				student: {
					_id: student._id,
					formNo: student.formNo,
					studentName: student.studentName,
					courses: student.courses,
					status: student.status,
				},
			});
		} catch (error) {
			console.error("❌ Error processing registration:", error);

			// Clean up uploaded files if database save fails
			if (
				req.files &&
				req.files.photo &&
				req.files.photo[0] &&
				photoPublicId
			) {
				try {
					await deleteFromCloudinary(photoPublicId);
				} catch (cleanupError) {
					console.error(
						"Error cleaning up uploaded photo:",
						cleanupError
					);
				}
			}

			res.status(500).json({ error: "Failed to process registration" });
		}
	}
);

// Public route - Get registration status by form number
router.get("/status/:formNo", async (req, res) => {
	try {
		const student = await Student.findByFormNo(req.params.formNo).select(
			"formNo studentName status createdAt courses"
		);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.json(student);
	} catch (error) {
		console.error("❌ Error fetching registration status:", error);
		res.status(500).json({ error: "Failed to fetch registration status" });
	}
});

// Public route - Get full registration details by form number (for PDF generation)
router.get("/details/:formNo", async (req, res) => {
	try {
		const student = await Student.findByFormNo(req.params.formNo);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.json({ student });
	} catch (error) {
		console.error("❌ Error fetching registration details:", error);
		res.status(500).json({ error: "Failed to fetch registration details" });
	}
});

// Admin routes

// Get all registrations (admin only)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
	try {
		console.log("🔒 Admin fetching all registrations...");

		const {
			page = 1,
			limit = 20,
			search,
			status,
			course,
			sortBy = "createdAt",
			sortOrder = "desc",
		} = req.query;

		const skip = (page - 1) * limit;

		// Build filter
		const filter = {};
		if (status) filter.status = status;
		if (course) filter.courses = { $in: [course] };

		let query = Student.find(filter);

		// Add search functionality
		if (search) {
			query = query.find({
				$or: [
					{ formNo: { $regex: search, $options: "i" } },
					{ studentName: { $regex: search, $options: "i" } },
					{ parentsName: { $regex: search, $options: "i" } },
					{ phoneNumber: { $regex: search, $options: "i" } },
				],
			});
		}

		// Apply sorting
		const sortOptions = {};
		sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

		// Execute query with pagination
		const students = await query
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit))
			.select("-photoPublicId -signaturePublicId");

		// Get total count for pagination
		const total = await Student.countDocuments(filter);

		console.log(`✅ Found ${students.length} registrations`);

		res.json({
			students,
			pagination: {
				current: parseInt(page),
				total: Math.ceil(total / limit),
				hasNext: skip + students.length < total,
				hasPrev: page > 1,
			},
			total,
		});
	} catch (error) {
		console.error("❌ Error fetching registrations:", error);
		res.status(500).json({ error: "Failed to fetch registrations" });
	}
});

// Get single registration (admin only)
router.get("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const student = await Student.findById(req.params.id).select(
			"-photoPublicId -signaturePublicId"
		);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.json(student);
	} catch (error) {
		console.error("❌ Error fetching registration:", error);
		res.status(500).json({ error: "Failed to fetch registration" });
	}
});

// Update registration status (admin only)
router.patch(
	"/admin/:id/status",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const { status, notes } = req.body;

			if (!["Pending", "Approved", "Rejected"].includes(status)) {
				return res.status(400).json({ error: "Invalid status" });
			}

			const student = await Student.findById(req.params.id);

			if (!student) {
				return res
					.status(404)
					.json({ error: "Registration not found" });
			}

			student.status = status;
			if (notes !== undefined) student.notes = notes;

			await student.save();

			console.log(
				`✅ Updated registration status: ${student.formNo} -> ${status}`
			);

			res.json({
				message: "Status updated successfully",
				student: {
					_id: student._id,
					formNo: student.formNo,
					studentName: student.studentName,
					status: student.status,
					notes: student.notes,
				},
			});
		} catch (error) {
			console.error("❌ Error updating status:", error);
			res.status(500).json({ error: "Failed to update status" });
		}
	}
);

// Delete registration (admin only)
router.delete(
	"/admin/:id",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const student = await Student.findById(req.params.id);

			if (!student) {
				return res
					.status(404)
					.json({ error: "Registration not found" });
			}

			// Delete files from Cloudinary
			if (student.photoPublicId) {
				await deleteFromCloudinary(student.photoPublicId);
			}
			if (student.signaturePublicId) {
				await deleteFromCloudinary(student.signaturePublicId);
			}

			await Student.findByIdAndDelete(req.params.id);

			console.log(
				`✅ Deleted registration: ${student.formNo} - ${student.studentName}`
			);

			res.json({ message: "Registration deleted successfully" });
		} catch (error) {
			console.error("❌ Error deleting registration:", error);
			res.status(500).json({ error: "Failed to delete registration" });
		}
	}
);

// Get registration statistics (admin only)
router.get(
	"/admin/stats/overview",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const stats = await Student.getStatistics();
			res.json(stats);
		} catch (error) {
			console.error("❌ Error fetching statistics:", error);
			res.status(500).json({ error: "Failed to fetch statistics" });
		}
	}
);

module.exports = router;
