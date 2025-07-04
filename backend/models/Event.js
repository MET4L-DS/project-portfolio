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
		eventDate: {
			type: Date,
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

// Virtual field for year (for backward compatibility)
eventSchema.virtual("year").get(function () {
	return this.eventDate.getFullYear().toString();
});

// Method to check if event is upcoming
eventSchema.methods.isUpcoming = function () {
	return this.eventDate > new Date();
};

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function () {
	return this.find({ eventDate: { $gt: new Date() } });
};

// Index for better search performance
eventSchema.index({ category: 1, importance: -1, eventDate: -1 });

module.exports = mongoose.model("Event", eventSchema);
