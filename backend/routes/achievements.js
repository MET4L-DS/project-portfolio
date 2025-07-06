const express = require("express");
const Achievement = require("../models/Achievement");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET all achievements (public)
router.get("/", async (req, res) => {
	try {
		const achievements = await Achievement.find({ isActive: true })
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(achievements);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching achievements",
			details: error.message,
		});
	}
});

// GET all achievements (admin)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const achievements = await Achievement.find()
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(achievements);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching achievements",
			details: error.message,
		});
	}
});

// GET single achievement by ID
router.get("/:id", async (req, res) => {
	try {
		const achievement = await Achievement.findById(req.params.id);
		if (!achievement) {
			return res.status(404).json({ error: "Achievement not found" });
		}
		res.json(achievement);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching achievement",
			details: error.message,
		});
	}
});

// POST create new achievement (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { title, icon, category, items, displayOrder } = req.body;

		// Validation
		if (!title || !icon || !category) {
			return res.status(400).json({
				error: "Title, icon, and category are required",
			});
		}

		const achievement = new Achievement({
			title,
			icon,
			category,
			items: items || [],
			displayOrder: displayOrder || 0,
		});

		await achievement.save();

		res.status(201).json({
			message: "Achievement created successfully",
			achievement,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error creating achievement",
			details: error.message,
		});
	}
});

// PUT update achievement (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { title, icon, category, items, displayOrder, isActive } =
			req.body;

		const achievement = await Achievement.findById(req.params.id);
		if (!achievement) {
			return res.status(404).json({ error: "Achievement not found" });
		}

		// Update fields
		if (title !== undefined) achievement.title = title;
		if (icon !== undefined) achievement.icon = icon;
		if (category !== undefined) achievement.category = category;
		if (items !== undefined) achievement.items = items;
		if (displayOrder !== undefined) achievement.displayOrder = displayOrder;
		if (isActive !== undefined) achievement.isActive = isActive;

		await achievement.save();

		res.json({
			message: "Achievement updated successfully",
			achievement,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error updating achievement",
			details: error.message,
		});
	}
});

// DELETE achievement (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const achievement = await Achievement.findById(req.params.id);
		if (!achievement) {
			return res.status(404).json({ error: "Achievement not found" });
		}

		await Achievement.findByIdAndDelete(req.params.id);

		res.json({
			message: "Achievement deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Error deleting achievement",
			details: error.message,
		});
	}
});

// POST toggle achievement status (admin only)
router.post(
	"/:id/toggle",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const achievement = await Achievement.findById(req.params.id);
			if (!achievement) {
				return res.status(404).json({ error: "Achievement not found" });
			}

			achievement.isActive = !achievement.isActive;
			await achievement.save();

			res.json({
				message: `Achievement ${
					achievement.isActive ? "activated" : "deactivated"
				} successfully`,
				achievement,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error toggling achievement status",
				details: error.message,
			});
		}
	}
);

module.exports = router;
