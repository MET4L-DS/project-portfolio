const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
	{
		year: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		logo: {
			type: String, // Image path or URL
		},
		logoAlt: {
			type: String,
		},
		logoDescription: {
			type: String,
		},
		displayOrder: {
			type: Number,
			default: 0,
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

module.exports = mongoose.model("Journey", journeySchema);
