const express = require("express");
const Journey = require("../models/Journey");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
	upload,
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

// GET all journey items (public)
router.get("/", async (req, res) => {
	try {
		const journeyItems = await Journey.find({ isActive: true })
			.sort({ displayOrder: 1, year: 1 })
			.select("-__v");

		res.json(journeyItems);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching journey items",
			details: error.message,
		});
	}
});

// GET all journey items (admin)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const journeyItems = await Journey.find()
			.sort({ displayOrder: 1, year: 1 })
			.select("-__v");

		res.json(journeyItems);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching journey items",
			details: error.message,
		});
	}
});

// GET single journey item by ID
router.get("/:id", async (req, res) => {
	try {
		const journeyItem = await Journey.findById(req.params.id);
		if (!journeyItem) {
			return res.status(404).json({ error: "Journey item not found" });
		}
		res.json(journeyItem);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching journey item",
			details: error.message,
		});
	}
});

// POST create new journey item (admin only)
router.post(
	"/",
	authenticateToken,
	requireAdmin,
	upload.single("logo"),
	async (req, res) => {
		try {
			const {
				year,
				title,
				description,
				logoAlt,
				logoDescription,
				displayOrder,
			} = req.body;

			// Validation
			if (!year || !title || !description) {
				return res.status(400).json({
					error: "Year, title, and description are required",
				});
			}

			// Handle logo upload
			let logoData = null;
			if (req.file) {
				logoData = await uploadToCloudinary(req.file.buffer, {
					folder: "portfolio-journey",
					public_id: `journey_logo_${Date.now()}`,
				});
			}

			const journeyItem = new Journey({
				year,
				title,
				description,
				logo: logoData
					? {
							url: logoData.url,
							publicId: logoData.publicId,
					  }
					: undefined,
				logoAlt,
				logoDescription,
				displayOrder: displayOrder || 0,
			});

			await journeyItem.save();

			res.status(201).json({
				message: "Journey item created successfully",
				journeyItem,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error creating journey item",
				details: error.message,
			});
		}
	}
);

// PUT update journey item (admin only)
router.put(
	"/:id",
	authenticateToken,
	requireAdmin,
	upload.single("logo"),
	async (req, res) => {
		try {
			const {
				year,
				title,
				description,
				logoAlt,
				logoDescription,
				displayOrder,
				isActive,
			} = req.body;

			const journeyItem = await Journey.findById(req.params.id);
			if (!journeyItem) {
				return res
					.status(404)
					.json({ error: "Journey item not found" });
			}

			// Update fields
			if (year !== undefined) journeyItem.year = year;
			if (title !== undefined) journeyItem.title = title;
			if (description !== undefined)
				journeyItem.description = description;
			if (logoAlt !== undefined) journeyItem.logoAlt = logoAlt;
			if (logoDescription !== undefined)
				journeyItem.logoDescription = logoDescription;
			if (displayOrder !== undefined)
				journeyItem.displayOrder = displayOrder;
			if (isActive !== undefined) journeyItem.isActive = isActive;

			// Handle logo update
			if (req.file) {
				// Delete old logo from Cloudinary if it exists
				if (journeyItem.logo && journeyItem.logo.publicId) {
					await deleteFromCloudinary(journeyItem.logo.publicId);
				}

				// Upload new logo
				const logoData = await uploadToCloudinary(req.file.buffer, {
					folder: "portfolio-journey",
					public_id: `journey_logo_${Date.now()}`,
				});

				journeyItem.logo = {
					url: logoData.url,
					publicId: logoData.publicId,
				};
			}

			await journeyItem.save();

			res.json({
				message: "Journey item updated successfully",
				journeyItem,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error updating journey item",
				details: error.message,
			});
		}
	}
);

// DELETE journey item (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const journeyItem = await Journey.findById(req.params.id);
		if (!journeyItem) {
			return res.status(404).json({ error: "Journey item not found" });
		}

		// Delete logo from Cloudinary if it exists
		if (journeyItem.logo && journeyItem.logo.publicId) {
			await deleteFromCloudinary(journeyItem.logo.publicId);
		}

		await Journey.findByIdAndDelete(req.params.id);

		res.json({
			message: "Journey item deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Error deleting journey item",
			details: error.message,
		});
	}
});

// POST toggle journey item status (admin only)
router.post(
	"/:id/toggle",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const journeyItem = await Journey.findById(req.params.id);
			if (!journeyItem) {
				return res
					.status(404)
					.json({ error: "Journey item not found" });
			}

			journeyItem.isActive = !journeyItem.isActive;
			await journeyItem.save();

			res.json({
				message: `Journey item ${
					journeyItem.isActive ? "activated" : "deactivated"
				} successfully`,
				journeyItem,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error toggling journey item status",
				details: error.message,
			});
		}
	}
);

module.exports = router;
