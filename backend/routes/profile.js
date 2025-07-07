const express = require("express");
const Profile = require("../models/Profile");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
	upload,
	uploadToCloudinary,
	uploadProfileToCloudinary,
	uploadLogoToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");

const router = express.Router();

// GET profile data (public)
router.get("/", async (req, res) => {
	try {
		let profile = await Profile.findOne({ isActive: true });

		// If no profile exists, create a default one
		if (!profile) {
			profile = new Profile({});
			await profile.save();
		}

		res.json(profile);
	} catch (error) {
		res.status(500).json({
			error: "Error fetching profile data",
			details: error.message,
		});
	}
});

// PUT update profile data (admin only)
router.put(
	"/",
	authenticateToken,
	requireAdmin,
	upload.single("profilePicture"),
	async (req, res) => {
		try {
			const {
				name,
				title,
				tagline,
				missionStatement,
				majorEvents,
				fashionShows,
				skillsTaught,
				yearsExperience,
			} = req.body;

			let profile = await Profile.findOne({ isActive: true });

			// If no profile exists, create a default one
			if (!profile) {
				profile = new Profile({});
			}

			// Update basic fields
			if (name !== undefined) profile.name = name;
			if (title !== undefined) profile.title = title;
			if (tagline !== undefined) profile.tagline = tagline;
			if (missionStatement !== undefined)
				profile.missionStatement = missionStatement;

			// Update stats
			if (majorEvents !== undefined)
				profile.stats.majorEvents = parseInt(majorEvents) || 0;
			if (fashionShows !== undefined)
				profile.stats.fashionShows = parseInt(fashionShows) || 0;
			if (skillsTaught !== undefined)
				profile.stats.skillsTaught = parseInt(skillsTaught) || 0;
			if (yearsExperience !== undefined)
				profile.stats.yearsExperience = parseInt(yearsExperience) || 0;

			// Handle profile picture update
			if (req.file) {
				// Delete old profile picture from Cloudinary if it exists
				if (profile.profilePicture && profile.profilePicture.publicId) {
					await deleteFromCloudinary(profile.profilePicture.publicId);
				}

				// Upload new profile picture (preserves aspect ratio)
				const profilePictureData = await uploadProfileToCloudinary(
					req.file.buffer,
					{
						folder: "portfolio-profile",
						public_id: `profile_picture_${Date.now()}`,
					}
				);

				profile.profilePicture = {
					url: profilePictureData.url,
					publicId: profilePictureData.publicId,
				};
			}

			await profile.save();

			res.json({
				message: "Profile updated successfully",
				profile,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error updating profile",
				details: error.message,
			});
		}
	}
);

// PUT update organization logos (admin only)
router.put(
	"/logos",
	authenticateToken,
	requireAdmin,
	upload.fields([
		{ name: "eventLogo", maxCount: 1 },
		{ name: "schoolLogo", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			let profile = await Profile.findOne({ isActive: true });

			// If no profile exists, create a default one
			if (!profile) {
				profile = new Profile({});
			}

			// Handle event logo update
			if (req.files && req.files.eventLogo) {
				// Delete old event logo from Cloudinary if it exists
				if (
					profile.organizationLogos.eventLogo &&
					profile.organizationLogos.eventLogo.publicId
				) {
					await deleteFromCloudinary(
						profile.organizationLogos.eventLogo.publicId
					);
				}

				// Upload new event logo (preserves aspect ratio)
				const eventLogoData = await uploadLogoToCloudinary(
					req.files.eventLogo[0].buffer,
					{
						folder: "portfolio-organization",
						public_id: `event_logo_${Date.now()}`,
					}
				);

				profile.organizationLogos.eventLogo = {
					url: eventLogoData.url,
					publicId: eventLogoData.publicId,
				};
			}

			// Handle school logo update
			if (req.files && req.files.schoolLogo) {
				// Delete old school logo from Cloudinary if it exists
				if (
					profile.organizationLogos.schoolLogo &&
					profile.organizationLogos.schoolLogo.publicId
				) {
					await deleteFromCloudinary(
						profile.organizationLogos.schoolLogo.publicId
					);
				}

				// Upload new school logo (preserves aspect ratio)
				const schoolLogoData = await uploadLogoToCloudinary(
					req.files.schoolLogo[0].buffer,
					{
						folder: "portfolio-organization",
						public_id: `school_logo_${Date.now()}`,
					}
				);

				profile.organizationLogos.schoolLogo = {
					url: schoolLogoData.url,
					publicId: schoolLogoData.publicId,
				};
			}

			await profile.save();

			res.json({
				message: "Organization logos updated successfully",
				profile,
			});
		} catch (error) {
			res.status(500).json({
				error: "Error updating organization logos",
				details: error.message,
			});
		}
	}
);

module.exports = router;
