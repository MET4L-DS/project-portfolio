const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Public routes
// Get all active services
router.get("/", async (req, res) => {
	try {
		const { category } = req.query;

		const filter = { isActive: true };
		if (category) {
			filter.category = category;
		}

		const services = await Service.find(filter)
			.sort({ displayOrder: 1, createdAt: 1 })
			.select("-__v");

		res.json(services);
	} catch (error) {
		console.error("Error fetching services:", error);
		res.status(500).json({ error: "Failed to fetch services" });
	}
});

// Get single service by ID
router.get("/:id", async (req, res) => {
	try {
		const service = await Service.findOne({
			_id: req.params.id,
			isActive: true,
		}).select("-__v");

		if (!service) {
			return res.status(404).json({ error: "Service not found" });
		}

		res.json(service);
	} catch (error) {
		console.error("Error fetching service:", error);
		res.status(500).json({ error: "Failed to fetch service" });
	}
});

// Admin routes (protected)
// Get all services for admin
router.get("/admin/all", authenticateToken, async (req, res) => {
	try {
		const { category } = req.query;

		const filter = {};
		if (category) {
			filter.category = category;
		}

		const services = await Service.find(filter)
			.sort({ displayOrder: 1, createdAt: 1 })
			.select("-__v");

		res.json(services);
	} catch (error) {
		console.error("Error fetching services for admin:", error);
		res.status(500).json({ error: "Failed to fetch services" });
	}
});

// Create new service
router.post("/", authenticateToken, async (req, res) => {
	try {
		const { title, icon, description, items, category, displayOrder } =
			req.body;

		// Validation
		if (!title || !icon || !category) {
			return res.status(400).json({
				error: "Title, icon, and category are required",
			});
		}

		const service = new Service({
			title,
			icon,
			description,
			items: items || [],
			category,
			displayOrder: displayOrder || 0,
		});

		await service.save();

		res.status(201).json(service);
	} catch (error) {
		console.error("Error creating service:", error);
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map(
				(err) => err.message
			);
			return res.status(400).json({ error: errors.join(", ") });
		}
		res.status(500).json({ error: "Failed to create service" });
	}
});

// Update service
router.put("/:id", authenticateToken, async (req, res) => {
	try {
		const {
			title,
			icon,
			description,
			items,
			category,
			displayOrder,
			isActive,
		} = req.body;

		const service = await Service.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ error: "Service not found" });
		}

		// Update fields
		if (title !== undefined) service.title = title;
		if (icon !== undefined) service.icon = icon;
		if (description !== undefined) service.description = description;
		if (items !== undefined) service.items = items;
		if (category !== undefined) service.category = category;
		if (displayOrder !== undefined) service.displayOrder = displayOrder;
		if (isActive !== undefined) service.isActive = isActive;

		await service.save();

		res.json(service);
	} catch (error) {
		console.error("Error updating service:", error);
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map(
				(err) => err.message
			);
			return res.status(400).json({ error: errors.join(", ") });
		}
		res.status(500).json({ error: "Failed to update service" });
	}
});

// Delete service
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const service = await Service.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ error: "Service not found" });
		}

		await Service.findByIdAndDelete(req.params.id);

		res.json({ message: "Service deleted successfully" });
	} catch (error) {
		console.error("Error deleting service:", error);
		res.status(500).json({ error: "Failed to delete service" });
	}
});

// Toggle service status
router.post("/:id/toggle", authenticateToken, async (req, res) => {
	try {
		const service = await Service.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ error: "Service not found" });
		}

		service.isActive = !service.isActive;
		await service.save();

		res.json(service);
	} catch (error) {
		console.error("Error toggling service status:", error);
		res.status(500).json({ error: "Failed to toggle service status" });
	}
});

module.exports = router;
