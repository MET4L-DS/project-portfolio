const express = require("express");
const Location = require("../models/Location");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET all locations (public)
router.get("/", async (req, res) => {
	try {
		const locations = await Location.find({ isActive: true })
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(locations);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching locations",
			details: error.message,
		});
	}
});

// GET all locations (admin)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const locations = await Location.find()
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(locations);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching locations",
			details: error.message,
		});
	}
});

// GET single location by ID
router.get("/:id", async (req, res) => {
	try {
		const location = await Location.findById(req.params.id);
		if (!location) {
			return res.status(404).json({ error: "Location not found" });
		}
		res.json(location);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching location",
			details: error.message,
		});
	}
});

// POST create new location (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { name, address, icon, displayOrder } = req.body;

		// Validation
		if (!name || !address) {
			return res.status(400).json({
				error: "Name and address are required",
			});
		}

		const location = new Location({
			name,
			address,
			icon: icon || "📍",
			displayOrder: displayOrder || 0,
		});

		await location.save();

		res.status(201).json({
			message: "Location created successfully",
			location,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error creating location",
			details: error.message,
		});
	}
});

// PUT update location (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { name, address, icon, displayOrder, isActive } = req.body;

		const location = await Location.findById(req.params.id);
		if (!location) {
			return res.status(404).json({ error: "Location not found" });
		}

		// Update fields
		if (name !== undefined) location.name = name;
		if (address !== undefined) location.address = address;
		if (icon !== undefined) location.icon = icon;
		if (displayOrder !== undefined) location.displayOrder = displayOrder;
		if (isActive !== undefined) location.isActive = isActive;

		await location.save();

		res.json({
			message: "Location updated successfully",
			location,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error updating location",
			details: error.message,
		});
	}
});

// DELETE location (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const location = await Location.findById(req.params.id);
		if (!location) {
			return res.status(404).json({ error: "Location not found" });
		}

		await Location.findByIdAndDelete(req.params.id);

		res.json({
			message: "Location deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Error deleting location",
			details: error.message,
		});
	}
});

// POST toggle location status (admin only)
router.post(
	"/:id/toggle",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const location = await Location.findById(req.params.id);
			if (!location) {
				return res.status(404).json({ error: "Location not found" });
			}

			location.isActive = !location.isActive;
			await location.save();

			res.json({
				message: `Location ${
					location.isActive ? "activated" : "deactivated"
				} successfully`,
				location,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error toggling location status",
				details: error.message,
			});
		}
	}
);

module.exports = router;
