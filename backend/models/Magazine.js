const mongoose = require("mongoose");

const magazineSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		year: {
			type: Number,
			required: true,
			min: 2020,
			max: new Date().getFullYear() + 1,
		},
		month: {
			type: String,
			required: true,
			enum: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			],
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		pdfUrl: {
			type: String,
			required: true,
		},
		pdfPublicId: {
			type: String,
			required: true,
		},
		coverImageUrl: {
			type: String,
			default: null,
		},
		coverImagePublicId: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		publishedDate: {
			type: Date,
			default: Date.now,
		},
		views: {
			type: Number,
			default: 0,
		},
		downloadCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Create compound index to ensure uniqueness of year-month combination
magazineSchema.index({ year: 1, month: 1 }, { unique: true });

// Create text index for search functionality
magazineSchema.index({
	title: "text",
	description: "text",
});

// Virtual for formatted date
magazineSchema.virtual("formattedDate").get(function () {
	return `${this.month} ${this.year}`;
});

// Virtual for magazine identifier
magazineSchema.virtual("identifier").get(function () {
	return `${this.year}-${this.month.toLowerCase()}`;
});

// Method to increment view count
magazineSchema.methods.incrementViews = function () {
	this.views += 1;
	return this.save();
};

// Method to increment download count
magazineSchema.methods.incrementDownloads = function () {
	this.downloadCount += 1;
	return this.save();
};

// Static method to find by year
magazineSchema.statics.findByYear = function (year) {
	return this.find({ year, isActive: true }).sort({ month: 1 });
};

// Static method to find latest magazines
magazineSchema.statics.findLatest = function (limit = 5) {
	return this.find({ isActive: true })
		.sort({ year: -1, publishedDate: -1 })
		.limit(limit);
};

// Pre-save middleware to ensure proper formatting
magazineSchema.pre("save", function (next) {
	if (this.title) {
		this.title = this.title.trim();
	}
	if (this.description) {
		this.description = this.description.trim();
	}
	next();
});

module.exports = mongoose.model("Magazine", magazineSchema);
