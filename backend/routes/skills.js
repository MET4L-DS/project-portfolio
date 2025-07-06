const express = require("express");
const Skill = require("../models/Skill");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET all skills (public)
router.get("/", async (req, res) => {
	try {
		const skills = await Skill.find({ isActive: true })
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(skills);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching skills",
			details: error.message,
		});
	}
});

// GET all skills (admin)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const skills = await Skill.find()
			.sort({ displayOrder: 1, createdAt: -1 })
			.select("-__v");

		res.json(skills);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching skills",
			details: error.message,
		});
	}
});

// GET single skill by ID
router.get("/:id", async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.id);
		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}
		res.json(skill);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching skill",
			details: error.message,
		});
	}
});

// POST create new skill (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { name, icon, description, displayOrder } = req.body;

		// Validation
		if (!name || !icon) {
			return res.status(400).json({
				error: "Name and icon are required",
			});
		}

		const skill = new Skill({
			name,
			icon,
			description,
			displayOrder: displayOrder || 0,
		});

		await skill.save();

		res.status(201).json({
			message: "Skill created successfully",
			skill,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error creating skill",
			details: error.message,
		});
	}
});

// PUT update skill (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const { name, icon, description, displayOrder, isActive } = req.body;

		const skill = await Skill.findById(req.params.id);
		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}

		// Update fields
		if (name !== undefined) skill.name = name;
		if (icon !== undefined) skill.icon = icon;
		if (description !== undefined) skill.description = description;
		if (displayOrder !== undefined) skill.displayOrder = displayOrder;
		if (isActive !== undefined) skill.isActive = isActive;

		await skill.save();

		res.json({
			message: "Skill updated successfully",
			skill,
		});
	} catch (error) {
		res.status(500).json({
			error: "Error updating skill",
			details: error.message,
		});
	}
});

// DELETE skill (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.id);
		if (!skill) {
			return res.status(404).json({ error: "Skill not found" });
		}

		await Skill.findByIdAndDelete(req.params.id);

		res.json({
			message: "Skill deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Error deleting skill",
			details: error.message,
		});
	}
});

// POST toggle skill status (admin only)
router.post(
	"/:id/toggle",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const skill = await Skill.findById(req.params.id);
			if (!skill) {
				return res.status(404).json({ error: "Skill not found" });
			}

			skill.isActive = !skill.isActive;
			await skill.save();

			res.json({
				message: `Skill ${
					skill.isActive ? "activated" : "deactivated"
				} successfully`,
				skill,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error toggling skill status",
				details: error.message,
			});
		}
	}
);

module.exports = router;
