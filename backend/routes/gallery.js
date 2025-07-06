const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
	upload,
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");

// Public routes
// Get all active gallery images
router.get("/", async (req, res) => {
	try {
		const { category } = req.query;

		const filter = { isActive: true };
		if (category) {
			filter.category = category;
		}

		const images = await Gallery.find(filter)
			.sort({ displayOrder: 1, createdAt: 1 })
			.select("-__v");

		res.json(images);
	} catch (error) {
		console.error("Error fetching gallery images:", error);
		res.status(500).json({ error: "Failed to fetch gallery images" });
	}
});

// Get single gallery image
router.get("/:id", async (req, res) => {
	try {
		const image = await Gallery.findOne({
			_id: req.params.id,
			isActive: true,
		}).select("-__v");

		if (!image) {
			return res.status(404).json({ error: "Gallery image not found" });
		}

		res.json(image);
	} catch (error) {
		console.error("Error fetching gallery image:", error);
		res.status(500).json({ error: "Failed to fetch gallery image" });
	}
});

// Admin routes (protected)
// Get all gallery images for admin
router.get("/admin/all", authenticateToken, async (req, res) => {
	try {
		const { category } = req.query;

		const filter = {};
		if (category) {
			filter.category = category;
		}

		const images = await Gallery.find(filter)
			.sort({ displayOrder: 1, createdAt: 1 })
			.select("-__v");

		res.json(images);
	} catch (error) {
		console.error("Error fetching gallery images:", error);
		res.status(500).json({ error: "Failed to fetch gallery images" });
	}
});

// Create new gallery image
router.post(
	"/",
	authenticateToken,
	upload.single("image"),
	async (req, res) => {
		try {
			const { title, description, category, displayOrder } = req.body;

			// Validate required fields
			if (!title || !category) {
				return res.status(400).json({
					error: "Missing required fields",
					required: ["title", "category"],
				});
			}

			if (!req.file) {
				return res.status(400).json({ error: "Image is required" });
			}

			// Upload image to Cloudinary
			const imageData = await uploadToCloudinary(req.file.buffer, {
				folder: `portfolio-gallery/${category.toLowerCase()}`,
				public_id: `gallery_${Date.now()}`,
			});

			// Create gallery image
			const galleryImage = new Gallery({
				title,
				description,
				category,
				displayOrder: displayOrder || 0,
				image: {
					url: imageData.url,
					publicId: imageData.publicId,
				},
			});

			await galleryImage.save();

			res.status(201).json({
				message: "Gallery image created successfully",
				image: galleryImage,
			});
		} catch (error) {
			console.error("Error creating gallery image:", error);
			res.status(500).json({
				error: "Failed to create gallery image",
				details: error.message,
			});
		}
	}
);

// Update gallery image
router.put(
	"/:id",
	authenticateToken,
	upload.single("image"),
	async (req, res) => {
		try {
			const { title, description, category, displayOrder, isActive } =
				req.body;

			const galleryImage = await Gallery.findById(req.params.id);
			if (!galleryImage) {
				return res
					.status(404)
					.json({ error: "Gallery image not found" });
			}

			// Update fields
			if (title) galleryImage.title = title;
			if (description !== undefined)
				galleryImage.description = description;
			if (category) galleryImage.category = category;
			if (displayOrder !== undefined)
				galleryImage.displayOrder = displayOrder;
			if (isActive !== undefined) galleryImage.isActive = isActive;

			// Handle image update
			if (req.file) {
				// Delete old image from Cloudinary
				if (galleryImage.image.publicId) {
					await deleteFromCloudinary(galleryImage.image.publicId);
				}

				// Upload new image to Cloudinary
				const imageData = await uploadToCloudinary(req.file.buffer, {
					folder: `portfolio-gallery/${category.toLowerCase()}`,
					public_id: `gallery_${Date.now()}`,
				});

				galleryImage.image = {
					url: imageData.url,
					publicId: imageData.publicId,
				};
			}

			await galleryImage.save();

			res.json({
				message: "Gallery image updated successfully",
				image: galleryImage,
			});
		} catch (error) {
			console.error("Error updating gallery image:", error);
			res.status(500).json({
				error: "Failed to update gallery image",
				details: error.message,
			});
		}
	}
);

// Delete gallery image
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const galleryImage = await Gallery.findById(req.params.id);
		if (!galleryImage) {
			return res.status(404).json({ error: "Gallery image not found" });
		}

		// Delete image from Cloudinary
		if (galleryImage.image.publicId) {
			await deleteFromCloudinary(galleryImage.image.publicId);
		}

		// Delete gallery image from database
		await Gallery.findByIdAndDelete(req.params.id);

		res.json({ message: "Gallery image deleted successfully" });
	} catch (error) {
		console.error("Error deleting gallery image:", error);
		res.status(500).json({
			error: "Failed to delete gallery image",
			details: error.message,
		});
	}
});

// Toggle gallery image status
router.post("/:id/toggle", authenticateToken, async (req, res) => {
	try {
		const galleryImage = await Gallery.findById(req.params.id);
		if (!galleryImage) {
			return res.status(404).json({ error: "Gallery image not found" });
		}

		galleryImage.isActive = !galleryImage.isActive;
		await galleryImage.save();

		res.json({
			message: `Gallery image ${
				galleryImage.isActive ? "activated" : "deactivated"
			} successfully`,
			image: galleryImage,
		});
	} catch (error) {
		console.error("Error toggling gallery image status:", error);
		res.status(500).json({
			error: "Failed to toggle gallery image status",
			details: error.message,
		});
	}
});

module.exports = router;
