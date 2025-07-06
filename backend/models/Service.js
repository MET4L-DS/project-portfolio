const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		icon: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		items: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				description: {
					type: String,
					trim: true,
				},
				displayOrder: {
					type: Number,
					default: 0,
				},
			},
		],
		category: {
			type: String,
			required: true,
			enum: ["Our Services", "Why Choose Us", "Other"],
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

module.exports = mongoose.model("Service", serviceSchema);
