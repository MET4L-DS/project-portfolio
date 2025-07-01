const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"Beauty Pageant",
				"Cultural Festival",
				"Fashion Show",
				"City Festival",
				"Cultural Event",
				"Talent Hunt",
			],
		},
		year: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		importance: {
			type: String,
			enum: ["high", "low"],
			default: "low",
		},
		image: {
			url: {
				type: String,
				required: true,
			},
			publicId: {
				type: String,
				required: true,
			},
		},
		gallery: [
			{
				url: {
					type: String,
					required: true,
				},
				publicId: {
					type: String,
					required: true,
				},
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// Index for better search performance
eventSchema.index({ category: 1, importance: -1, year: -1 });

module.exports = mongoose.model("Event", eventSchema);
