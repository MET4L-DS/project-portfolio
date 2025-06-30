const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
	{
		formNo: {
			type: String,
			unique: true,
		},
		studentName: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			line1: {
				type: String,
				required: true,
				trim: true,
			},
			line2: {
				type: String,
				trim: true,
			},
			line3: {
				type: String,
				trim: true,
			},
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["Male", "Female", "Other"],
		},
		age: {
			type: Number,
			required: true,
			min: 3,
			max: 100,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		parentsName: {
			type: String,
			required: true,
			trim: true,
		},
		parentsNumber: {
			type: String,
			required: true,
			trim: true,
		},
		courses: [
			{
				type: String,
				enum: [
					"Art",
					"Craft",
					"Acting",
					"Singing",
					"Yoga",
					"Dance",
					"Karate",
					"Stitching",
					"Mehendi",
					"Modelling",
					"Makeup",
					"Photography",
					"Beautician",
				],
			},
		],
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

// Auto-generate form number
studentSchema.pre("save", async function (next) {
	if (!this.formNo) {
		const count = await mongoose.model("Student").countDocuments();
		this.formNo = `SKP${String(count + 1).padStart(4, "0")}`;
	}
	next();
});

// Virtual for full address
studentSchema.virtual("fullAddress").get(function () {
	return [this.address.line1, this.address.line2, this.address.line3]
		.filter((line) => line && line.trim())
		.join(", ");
});

// Virtual for courses as comma-separated string
studentSchema.virtual("coursesString").get(function () {
	return this.courses.join(", ");
});

// Static method to find by form number
studentSchema.statics.findByFormNo = function (formNo) {
	return this.findOne({ formNo });
};

// Static method to get statistics
studentSchema.statics.getStatistics = async function () {
	const totalStudents = await this.countDocuments();
	const approvedStudents = await this.countDocuments({ status: "Approved" });
	const pendingStudents = await this.countDocuments({ status: "Pending" });

	const courseStats = await this.aggregate([
		{ $unwind: "$courses" },
		{ $group: { _id: "$courses", count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
	]);

	return {
		totalStudents,
		approvedStudents,
		pendingStudents,
		courseStats,
	};
};

module.exports = mongoose.model("Student", studentSchema);
