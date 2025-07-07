const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			default: "Saurav Shil",
		},
		title: {
			type: String,
			required: true,
			default: "Event Management & Media Pioneer",
		},
		tagline: {
			type: String,
			required: true,
			default: "Your Vision, Our Spectacle",
		},
		missionStatement: {
			type: String,
			required: true,
			default:
				"Transforming Northeast India's cultural landscape through world-class events, traditional runway shows, and comprehensive arts education. Celebrating tribal heritage while nurturing the next generation of artists and performers.",
		},
		profilePicture: {
			url: {
				type: String,
				required: true,
				default: "/profile-picture-2.jpg",
			},
			publicId: {
				type: String,
				default: null,
			},
		},
		organizationLogos: {
			eventLogo: {
				url: {
					type: String,
					default: "./logo/sankalp_event_entertainment.jpg",
				},
				publicId: {
					type: String,
					default: null,
				},
			},
			schoolLogo: {
				url: {
					type: String,
					default: "./logo/sankalp_school.jpg",
				},
				publicId: {
					type: String,
					default: null,
				},
			},
		},
		stats: {
			majorEvents: {
				type: Number,
				default: 15,
			},
			fashionShows: {
				type: Number,
				default: 8,
			},
			skillsTaught: {
				type: Number,
				default: 13,
			},
			yearsExperience: {
				type: Number,
				default: 6,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Profile", profileSchema);
