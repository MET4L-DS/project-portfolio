const express = require("express");
const Candidate = require("../models/Candidate");
const Event = require("../models/Event");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
	upload,
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");
const router = express.Router();

// @route   POST /api/candidates
// @desc    Register a new candidate for an event
// @access  Public
router.post("/", upload.single("photo"), async (req, res) => {
	try {
		const {
			eventId,
			firstName,
			lastName,
			dateOfBirth,
			address,
			educationalLevel,
			gender,
			height,
			parentFirstName,
			parentLastName,
			parentOccupation,
			parentContactNo,
			parentDeclaration,
		} = req.body;

		// Validate required fields
		if (
			!eventId ||
			!firstName ||
			!lastName ||
			!dateOfBirth ||
			!address ||
			!educationalLevel ||
			!gender ||
			!height ||
			!parentFirstName ||
			!parentLastName ||
			!parentOccupation ||
			!parentContactNo
		) {
			return res.status(400).json({
				success: false,
				message: "All required fields must be provided",
			});
		}

		// Check if event exists
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Prepare candidate data
		const candidateData = {
			eventId,
			eventName: event.title,
			firstName,
			lastName,
			dateOfBirth: new Date(dateOfBirth),
			address,
			educationalLevel,
			gender,
			height,
			parentFirstName,
			parentLastName,
			parentOccupation,
			parentContactNo,
			parentDeclaration:
				parentDeclaration === "true" || parentDeclaration === true,
		};

		// Add photo if uploaded
		if (req.file) {
			try {
				const uploadResult = await uploadToCloudinary(req.file.buffer, {
					folder: "candidates",
					transformation: [
						{
							width: 300,
							height: 400,
							crop: "fill",
							quality: "auto",
						},
					],
				});
				candidateData.photoUrl = uploadResult.url;
				candidateData.photoPublicId = uploadResult.publicId;
			} catch (uploadError) {
				console.error("Photo upload error:", uploadError);
				return res.status(500).json({
					success: false,
					message: "Failed to upload photo",
				});
			}
		}

		// Create new candidate
		const candidate = new Candidate(candidateData);
		await candidate.save();

		res.status(201).json({
			success: true,
			message: "Candidate registered successfully",
			data: candidate,
		});
	} catch (error) {
		console.error("Candidate registration error:", error);

		// Delete uploaded image if candidate creation failed
		if (req.file) {
			// Since we're using memory storage, no cleanup needed for failed uploads
			console.error(
				"Candidate creation failed, but photo wasn't uploaded to cloud yet"
			);
		}

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "Candidate with this form number already exists",
			});
		}

		res.status(500).json({
			success: false,
			message: "Server error during candidate registration",
			error:
				process.env.NODE_ENV === "development"
					? error.message
					: undefined,
		});
	}
});

// @route   GET /api/candidates/form/:formNo
// @desc    Get candidate by form number (public)
// @access  Public
router.get("/form/:formNo", async (req, res) => {
	try {
		const candidate = await Candidate.findOne({
			formNo: req.params.formNo,
		}).populate("eventId");

		if (!candidate) {
			return res.status(404).json({
				success: false,
				message: "Candidate not found",
			});
		}

		res.json({
			success: true,
			data: candidate,
		});
	} catch (error) {
		console.error("Error fetching candidate by form number:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
});

// @route   GET /api/candidates
// @desc    Get all candidates (admin only)
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
	try {
		const { eventId, status, page = 1, limit = 10 } = req.query;

		const query = {};
		if (eventId) query.eventId = eventId;
		if (status) query.status = status;

		const candidates = await Candidate.find(query)
			.populate("eventId", "title category year")
			.sort({ createdAt: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);

		const total = await Candidate.countDocuments(query);

		res.json({
			success: true,
			data: {
				candidates,
				total,
				page: parseInt(page),
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Get candidates error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching candidates",
		});
	}
});

// @route   GET /api/candidates/:id
// @desc    Get single candidate
// @access  Private
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const candidate = await Candidate.findById(req.params.id).populate(
			"eventId"
		);

		if (!candidate) {
			return res.status(404).json({
				success: false,
				message: "Candidate not found",
			});
		}

		res.json({
			success: true,
			data: candidate,
		});
	} catch (error) {
		console.error("Get candidate error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching candidate",
		});
	}
});

// @route   PUT /api/candidates/:id
// @desc    Update candidate status (admin only)
// @access  Private
router.put("/:id", authenticateToken, async (req, res) => {
	try {
		const { status, notes } = req.body;

		const candidate = await Candidate.findById(req.params.id);
		if (!candidate) {
			return res.status(404).json({
				success: false,
				message: "Candidate not found",
			});
		}

		if (status) candidate.status = status;
		if (notes !== undefined) candidate.notes = notes;

		await candidate.save();

		res.json({
			success: true,
			message: "Candidate updated successfully",
			data: candidate,
		});
	} catch (error) {
		console.error("Update candidate error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while updating candidate",
		});
	}
});

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate (admin only)
// @access  Private
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const candidate = await Candidate.findById(req.params.id);
		if (!candidate) {
			return res.status(404).json({
				success: false,
				message: "Candidate not found",
			});
		}

		// Delete photo from Cloudinary if exists
		if (candidate.photoPublicId) {
			try {
				await deleteFromCloudinary(candidate.photoPublicId);
			} catch (deleteError) {
				console.error("Error deleting candidate photo:", deleteError);
			}
		}

		await Candidate.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Candidate deleted successfully",
		});
	} catch (error) {
		console.error("Delete candidate error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting candidate",
		});
	}
});

module.exports = router;
