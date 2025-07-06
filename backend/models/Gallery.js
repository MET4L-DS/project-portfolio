const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
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
		category: {
			type: String,
			required: true,
			enum: ["Services", "School"],
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

// Index for better query performance
gallerySchema.index({ category: 1, isActive: 1, displayOrder: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
