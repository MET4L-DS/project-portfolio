const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
	{
		formNo: {
			type: String,
			unique: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		eventName: {
			type: String,
			required: true,
			trim: true,
		},
		// Applicant Details
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		educationalLevel: {
			type: String,
			required: true,
			trim: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["Male", "Female", "Other"],
		},
		height: {
			type: String,
			required: true,
			trim: true,
		},
		// Parent's Information
		parentFirstName: {
			type: String,
			required: true,
			trim: true,
		},
		parentLastName: {
			type: String,
			required: true,
			trim: true,
		},
		parentOccupation: {
			type: String,
			required: true,
			trim: true,
		},
		parentContactNo: {
			type: String,
			required: true,
			trim: true,
		},
		// Declaration
		parentDeclaration: {
			type: Boolean,
			required: true,
			default: false,
		},
		// Photo
		photoUrl: {
			type: String,
			default: null,
		},
		photoPublicId: {
			type: String,
			default: null,
		},
		registrationDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ["Pending", "Approved", "Rejected"],
			default: "Pending",
		},
		notes: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Generate unique form number before saving
candidateSchema.pre("save", async function (next) {
	if (!this.formNo) {
		const count = await this.constructor.countDocuments();
		this.formNo = `CND${String(count + 1).padStart(4, "0")}`;
	}
	next();
});

// Virtual for full name
candidateSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Virtual for parent full name
candidateSchema.virtual("parentFullName").get(function () {
	return `${this.parentFirstName} ${this.parentLastName}`;
});

// Ensure virtual fields are serialized
candidateSchema.set("toJSON", { virtuals: true });
candidateSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Candidate", candidateSchema);
