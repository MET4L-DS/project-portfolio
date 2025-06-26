const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
	upload,
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

// GET all events (public)
router.get("/", async (req, res) => {
	try {
		const { category, importance, page = 1, limit = 20 } = req.query;

		// Build filter
		const filter = { isActive: true };
		if (category && category !== "All") {
			filter.category = category;
		}
		if (importance) {
			filter.importance = importance;
		}

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Fetch events with sorting
		const events = await Event.find(filter)
			.sort({ importance: -1, year: -1, createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit))
			.select("-__v");

		// Get total count for pagination
		const total = await Event.countDocuments(filter);

		res.json({
			events,
			pagination: {
				current: parseInt(page),
				pages: Math.ceil(total / limit),
				total,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Error fetching events",
			details: error.message,
		});
	}
});

// GET single event (public)
router.get("/:id", async (req, res) => {
	try {
		const event = await Event.findOne({
			_id: req.params.id,
			isActive: true,
		}).select("-__v");

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		res.json(event);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching event",
			details: error.message,
		});
	}
});

// GET all events for admin (includes inactive)
router.get("/admin/all", authenticateToken, async (req, res) => {
	try {
		const { category, importance, page = 1, limit = 20 } = req.query;

		// Build filter (don't filter by isActive for admin)
		const filter = {};
		if (category && category !== "All") {
			filter.category = category;
		}
		if (importance) {
			filter.importance = importance;
		}

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Fetch events with sorting
		const events = await Event.find(filter)
			.sort({ importance: -1, year: -1, createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit))
			.select("-__v");

		// Get total count for pagination
		const total = await Event.countDocuments(filter);

		res.json({
			events,
			pagination: {
				current: parseInt(page),
				pages: Math.ceil(total / limit),
				total,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Error fetching events",
			details: error.message,
		});
	}
});

// POST create new event (admin only)
router.post(
	"/",
	authenticateToken,
	requireAdmin,
	upload.single("image"),
	async (req, res) => {
		try {
			console.log("📝 Creating new event...");
			console.log("📋 Request body:", req.body);
			console.log("📁 File uploaded:", !!req.file);

			const { title, category, year, location, description, importance } =
				req.body;

			// Validate required fields
			if (!title || !category || !year || !location || !description) {
				return res.status(400).json({
					error: "Missing required fields",
					required: [
						"title",
						"category",
						"year",
						"location",
						"description",
					],
				});
			}

			if (!req.file) {
				return res.status(400).json({ error: "Image is required" });
			}

			// Check MongoDB connection
			if (mongoose.connection.readyState !== 1) {
				return res.status(500).json({
					error: "Database connection unavailable",
					details: "Please check MongoDB Atlas connection",
				});
			}

			// Check Cloudinary configuration
			if (
				!process.env.CLOUDINARY_CLOUD_NAME ||
				!process.env.CLOUDINARY_API_KEY ||
				!process.env.CLOUDINARY_API_SECRET
			) {
				return res.status(500).json({
					error: "Cloudinary configuration missing",
					details: "Please check Cloudinary environment variables",
				});
			}

			console.log("☁️ Uploading to Cloudinary...");
			// Upload image to Cloudinary
			const imageData = await uploadToCloudinary(req.file.buffer, {
				folder: "portfolio-events",
				public_id: `event_${Date.now()}`,
			});

			console.log("✅ Image uploaded successfully:", imageData.url);

			console.log("💾 Saving to database...");
			// Create event
			const event = new Event({
				title,
				category,
				year,
				location,
				description,
				importance: importance || "low",
				image: {
					url: imageData.url,
					publicId: imageData.publicId,
				},
			});

			await event.save();

			console.log("✅ Event created successfully:", event._id);

			res.status(201).json({
				message: "Event created successfully",
				event,
			});
		} catch (error) {
			console.error("❌ Error creating event:", error);

			// Handle specific error types
			if (error.name === "ValidationError") {
				return res.status(400).json({
					error: "Validation error",
					details: error.message,
					fields: Object.keys(error.errors),
				});
			}

			if (error.message.includes("Cloudinary")) {
				return res.status(500).json({
					error: "Image upload failed",
					details: error.message,
				});
			}

			res.status(500).json({
				error: "Error creating event",
				details: error.message,
				stack:
					process.env.NODE_ENV === "development"
						? error.stack
						: undefined,
			});
		}
	}
);

// PUT update event (admin only)
router.put(
	"/:id",
	authenticateToken,
	requireAdmin,
	upload.single("image"),
	async (req, res) => {
		try {
			const {
				title,
				category,
				year,
				location,
				description,
				importance,
				isActive,
			} = req.body;

			const event = await Event.findById(req.params.id);
			if (!event) {
				return res.status(404).json({ error: "Event not found" });
			}

			// Update fields
			if (title) event.title = title;
			if (category) event.category = category;
			if (year) event.year = year;
			if (location) event.location = location;
			if (description) event.description = description;
			if (importance) event.importance = importance;
			if (isActive !== undefined) event.isActive = isActive;

			// Handle image update
			if (req.file) {
				// Delete old image from Cloudinary
				if (event.image.publicId) {
					await deleteFromCloudinary(event.image.publicId);
				}

				// Upload new image
				const imageData = await uploadToCloudinary(req.file.buffer, {
					folder: "portfolio-events",
					public_id: `event_${Date.now()}`,
				});

				event.image = {
					url: imageData.url,
					publicId: imageData.publicId,
				};
			}

			await event.save();

			res.json({
				message: "Event updated successfully",
				event,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error updating event",
				details: error.message,
			});
		}
	}
);

// DELETE event (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		// Delete image from Cloudinary
		if (event.image.publicId) {
			await deleteFromCloudinary(event.image.publicId);
		}

		// Delete event from database
		await Event.findByIdAndDelete(req.params.id);

		res.json({ message: "Event deleted successfully" });
	} catch (error) {
		res.status(500).json({
			error: "Error deleting event",
			details: error.message,
		});
	}
});

// GET event categories
router.get("/meta/categories", (req, res) => {
	const categories = [
		"Beauty Pageant",
		"Cultural Festival",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];
	res.json({ categories });
});

module.exports = router;
