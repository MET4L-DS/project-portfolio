const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
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
		category: {
			type: String,
			required: true,
			enum: [
				"Event Organizer",
				"Production Leadership",
				"Special Projects",
				"Media Ventures",
				"Awards",
				"Other",
			],
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

module.exports = mongoose.model("Achievement", achievementSchema);
