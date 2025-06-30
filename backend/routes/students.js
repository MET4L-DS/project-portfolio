const express = require("express");
const multer = require("multer");
const puppeteer = require("puppeteer");
const {
	uploadToCloudinary,
	deleteFromCloudinary,
} = require("../config/cloudinary");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const Student = require("../models/Student");

const router = express.Router();

// Configure multer for file upload
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit for photos
	},
	fileFilter: (req, file, cb) => {
		if (file.fieldname === "photo") {
			// Accept only image files
			if (file.mimetype.startsWith("image/")) {
				cb(null, true);
			} else {
				cb(new Error("Only image files are allowed"), false);
			}
		} else {
			cb(new Error("Invalid field name"), false);
		}
	},
});

// Public route - Submit student registration
router.post(
	"/register",
	upload.fields([{ name: "photo", maxCount: 1 }]),
	async (req, res) => {
		try {
			console.log("📝 Processing student registration...");
			console.log("📋 Registration data:", req.body);

			const {
				studentName,
				addressLine1,
				addressLine2,
				addressLine3,
				phoneNumber,
				gender,
				age,
				dateOfBirth,
				parentsName,
				parentsNumber,
				courses,
				registrationDate,
			} = req.body;

			// Validate required fields
			if (
				!studentName ||
				!addressLine1 ||
				!phoneNumber ||
				!gender ||
				!age ||
				!dateOfBirth ||
				!parentsName ||
				!parentsNumber ||
				!registrationDate
			) {
				return res.status(400).json({
					error: "All required fields must be filled",
				});
			}

			// Parse courses (could be a string or array)
			let selectedCourses = [];
			if (courses) {
				if (typeof courses === "string") {
					selectedCourses = courses
						.split(",")
						.map((c) => c.trim())
						.filter((c) => c);
				} else if (Array.isArray(courses)) {
					selectedCourses = courses;
				}
			}

			if (selectedCourses.length === 0) {
				return res.status(400).json({
					error: "At least one course must be selected",
				});
			}

			let photoUrl = null;
			let photoPublicId = null;

			// Upload photo if provided
			if (req.files && req.files.photo && req.files.photo[0]) {
				console.log("📸 Uploading student photo...");

				const photoFile = req.files.photo[0];
				const photoUploadResult = await uploadToCloudinary(
					photoFile.buffer,
					{
						folder: "students/photos",
						transformation: [
							{
								width: 300,
								height: 400,
								crop: "fill",
								quality: "auto",
							},
						],
					}
				);

				photoUrl = photoUploadResult.url;
				photoPublicId = photoUploadResult.publicId;

				console.log("✅ Photo uploaded successfully");
			}

			// Create student registration
			const student = new Student({
				studentName,
				address: {
					line1: addressLine1,
					line2: addressLine2 || "",
					line3: addressLine3 || "",
				},
				phoneNumber,
				gender,
				age: parseInt(age),
				dateOfBirth: new Date(dateOfBirth),
				parentsName,
				parentsNumber,
				courses: selectedCourses,
				photoUrl,
				photoPublicId,
				registrationDate: new Date(registrationDate),
			});

			await student.save();

			console.log(
				`✅ Student registration created: ${student.formNo} - ${student.studentName}`
			);

			res.status(201).json({
				message: "Registration submitted successfully",
				formNo: student.formNo,
				student: {
					_id: student._id,
					formNo: student.formNo,
					studentName: student.studentName,
					courses: student.courses,
					status: student.status,
				},
			});
		} catch (error) {
			console.error("❌ Error processing registration:", error);

			// Clean up uploaded files if database save fails
			if (
				req.files &&
				req.files.photo &&
				req.files.photo[0] &&
				photoPublicId
			) {
				try {
					await deleteFromCloudinary(photoPublicId);
				} catch (cleanupError) {
					console.error(
						"Error cleaning up uploaded photo:",
						cleanupError
					);
				}
			}

			res.status(500).json({ error: "Failed to process registration" });
		}
	}
);

// Public route - Get registration status by form number
router.get("/status/:formNo", async (req, res) => {
	try {
		const student = await Student.findByFormNo(req.params.formNo).select(
			"formNo studentName status createdAt courses"
		);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.json(student);
	} catch (error) {
		console.error("❌ Error fetching registration status:", error);
		res.status(500).json({ error: "Failed to fetch registration status" });
	}
});

// Admin routes

// Get all registrations (admin only)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
	try {
		console.log("🔒 Admin fetching all registrations...");

		const {
			page = 1,
			limit = 20,
			search,
			status,
			course,
			sortBy = "createdAt",
			sortOrder = "desc",
		} = req.query;

		const skip = (page - 1) * limit;

		// Build filter
		const filter = {};
		if (status) filter.status = status;
		if (course) filter.courses = { $in: [course] };

		let query = Student.find(filter);

		// Add search functionality
		if (search) {
			query = query.find({
				$or: [
					{ formNo: { $regex: search, $options: "i" } },
					{ studentName: { $regex: search, $options: "i" } },
					{ parentsName: { $regex: search, $options: "i" } },
					{ phoneNumber: { $regex: search, $options: "i" } },
				],
			});
		}

		// Apply sorting
		const sortOptions = {};
		sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

		// Execute query with pagination
		const students = await query
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit))
			.select("-photoPublicId -signaturePublicId");

		// Get total count for pagination
		const total = await Student.countDocuments(filter);

		console.log(`✅ Found ${students.length} registrations`);

		res.json({
			students,
			pagination: {
				current: parseInt(page),
				total: Math.ceil(total / limit),
				hasNext: skip + students.length < total,
				hasPrev: page > 1,
			},
			total,
		});
	} catch (error) {
		console.error("❌ Error fetching registrations:", error);
		res.status(500).json({ error: "Failed to fetch registrations" });
	}
});

// Get single registration (admin only)
router.get("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
	try {
		const student = await Student.findById(req.params.id).select(
			"-photoPublicId -signaturePublicId"
		);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		res.json(student);
	} catch (error) {
		console.error("❌ Error fetching registration:", error);
		res.status(500).json({ error: "Failed to fetch registration" });
	}
});

// Update registration status (admin only)
router.patch(
	"/admin/:id/status",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const { status, notes } = req.body;

			if (!["Pending", "Approved", "Rejected"].includes(status)) {
				return res.status(400).json({ error: "Invalid status" });
			}

			const student = await Student.findById(req.params.id);

			if (!student) {
				return res
					.status(404)
					.json({ error: "Registration not found" });
			}

			student.status = status;
			if (notes !== undefined) student.notes = notes;

			await student.save();

			console.log(
				`✅ Updated registration status: ${student.formNo} -> ${status}`
			);

			res.json({
				message: "Status updated successfully",
				student: {
					_id: student._id,
					formNo: student.formNo,
					studentName: student.studentName,
					status: student.status,
					notes: student.notes,
				},
			});
		} catch (error) {
			console.error("❌ Error updating status:", error);
			res.status(500).json({ error: "Failed to update status" });
		}
	}
);

// Delete registration (admin only)
router.delete(
	"/admin/:id",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const student = await Student.findById(req.params.id);

			if (!student) {
				return res
					.status(404)
					.json({ error: "Registration not found" });
			}

			// Delete files from Cloudinary
			if (student.photoPublicId) {
				await deleteFromCloudinary(student.photoPublicId);
			}
			if (student.signaturePublicId) {
				await deleteFromCloudinary(student.signaturePublicId);
			}

			await Student.findByIdAndDelete(req.params.id);

			console.log(
				`✅ Deleted registration: ${student.formNo} - ${student.studentName}`
			);

			res.json({ message: "Registration deleted successfully" });
		} catch (error) {
			console.error("❌ Error deleting registration:", error);
			res.status(500).json({ error: "Failed to delete registration" });
		}
	}
);

// Get registration statistics (admin only)
router.get(
	"/admin/stats/overview",
	authenticateToken,
	requireAdmin,
	async (req, res) => {
		try {
			const stats = await Student.getStatistics();
			res.json(stats);
		} catch (error) {
			console.error("❌ Error fetching statistics:", error);
			res.status(500).json({ error: "Failed to fetch statistics" });
		}
	}
);

// PDF Generation Route
router.get("/pdf/:formNo", async (req, res) => {
	try {
		const student = await Student.findByFormNo(req.params.formNo);

		if (!student) {
			return res.status(404).json({ error: "Registration not found" });
		}

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		// Generate HTML content for the registration form
		const htmlContent = generateRegistrationFormHTML(student);

		await page.setContent(htmlContent, { waitUntil: "networkidle0" });

		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "20px",
				bottom: "20px",
				left: "20px",
				right: "20px",
			},
		});

		await browser.close();

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename=registration-${student.formNo}.pdf`
		);
		res.send(pdf);
	} catch (error) {
		console.error("❌ Error generating PDF:", error);
		res.status(500).json({ error: "Failed to generate PDF" });
	}
});

// Function to generate HTML content for the registration form
function generateRegistrationFormHTML(student) {
	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-IN");
	};

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body {
					font-family: Arial, sans-serif;
					margin: 0;
					padding: 20px;
					background: white;
				}
				.form-container {
					max-width: 800px;
					margin: 0 auto;
					border: 2px solid #000;
					padding: 20px;
				}
				.header {
					text-align: center;
					margin-bottom: 30px;
					border-bottom: 2px solid #000;
					padding-bottom: 15px;
				}
				.school-name {
					font-size: 24px;
					font-weight: bold;
					color: #000;
					margin-bottom: 5px;
				}
				.school-subtitle {
					font-size: 16px;
					color: #666;
					margin-bottom: 10px;
				}
				.form-title {
					font-size: 20px;
					font-weight: bold;
					text-decoration: underline;
					margin-top: 10px;
				}
				.form-content {
					display: flex;
					gap: 20px;
				}
				.left-column {
					flex: 2;
				}
				.right-column {
					flex: 1;
				}
				.photo-box {
					width: 120px;
					height: 160px;
					border: 2px solid #000;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 20px;
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
				}
				.form-row {
					margin-bottom: 15px;
					display: flex;
					align-items: center;
				}
				.form-label {
					font-weight: bold;
					min-width: 140px;
					margin-right: 10px;
				}
				.form-value {
					border-bottom: 1px solid #000;
					flex: 1;
					padding: 2px 5px;
					min-height: 18px;
				}
				.address-section {
					margin-bottom: 15px;
				}
				.address-line {
					margin-bottom: 8px;
					display: flex;
					align-items: center;
				}
				.courses-section {
					margin: 20px 0;
					border: 1px solid #000;
					padding: 15px;
				}
				.courses-title {
					font-weight: bold;
					margin-bottom: 10px;
					text-decoration: underline;
				}
				.courses-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 10px;
					margin-bottom: 10px;
				}
				.course-item {
					display: flex;
					align-items: center;
					gap: 5px;
				}
				.checkbox {
					width: 15px;
					height: 15px;
					border: 1px solid #000;
					display: inline-block;
					text-align: center;
					line-height: 13px;
					font-size: 12px;
				}
				.signature-section {
					margin-top: 40px;
					display: flex;
					justify-content: space-between;
				}
				.signature-box {
					width: 200px;
					text-align: center;
				}
				.signature-line {
					border-bottom: 1px solid #000;
					height: 60px;
					margin-bottom: 10px;
				}
				.form-no-box {
					position: absolute;
					top: 20px;
					right: 20px;
					border: 2px solid #000;
					padding: 10px;
					font-weight: bold;
				}
			</style>
		</head>
		<body>
			<div class="form-container">
				<div class="form-no-box">
					Form No: ${student.formNo}
				</div>
				
				<div class="header">
					<div class="school-name">SANKALP SCHOOL OF ART AND SKILLS</div>
					<div class="school-subtitle">"Confidence Starts Here"</div>
					<div class="form-title">STUDENT REGISTRATION FORM</div>
				</div>

				<div class="form-content">
					<div class="left-column">
						<div class="form-row">
							<span class="form-label">Student Name:</span>
							<span class="form-value">${student.studentName}</span>
						</div>

						<div class="address-section">
							<div class="address-line">
								<span class="form-label">Address:</span>
								<span class="form-value">${student.address.line1}</span>
							</div>
							<div class="address-line">
								<span class="form-label"></span>
								<span class="form-value">${student.address.line2 || ""}</span>
							</div>
							<div class="address-line">
								<span class="form-label"></span>
								<span class="form-value">${student.address.line3 || ""}</span>
							</div>
						</div>

						<div class="form-row">
							<span class="form-label">Phone Number:</span>
							<span class="form-value">${student.phoneNumber}</span>
						</div>

						<div class="form-row">
							<span class="form-label">Gender:</span>
							<span class="form-value">${student.gender}</span>
							<span class="form-label" style="margin-left: 50px;">Age:</span>
							<span class="form-value" style="width: 80px;">${student.age}</span>
						</div>

						<div class="form-row">
							<span class="form-label">Date of Birth:</span>
							<span class="form-value">${formatDate(student.dateOfBirth)}</span>
						</div>

						<div class="form-row">
							<span class="form-label">Parents' Name:</span>
							<span class="form-value">${student.parentsName}</span>
						</div>

						<div class="form-row">
							<span class="form-label">Parents' Number:</span>
							<span class="form-value">${student.parentsNumber}</span>
						</div>

						<div class="form-row">
							<span class="form-label">Registration Date:</span>
							<span class="form-value">${formatDate(student.registrationDate)}</span>
						</div>
					</div>

					<div class="right-column">
						<div class="photo-box" ${
							student.photoUrl
								? `style="background-image: url(${student.photoUrl})"`
								: ""
						}>
							${!student.photoUrl ? "PASSPORT SIZE PHOTO" : ""}
						</div>
					</div>
				</div>

				<div class="courses-section">
					<div class="courses-title">COURSE OPTIONS (✓ Selected Courses):</div>
					<div class="courses-grid">
						${[
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
						]
							.map(
								(course) =>
									`<div class="course-item">
								<span class="checkbox">${student.courses.includes(course) ? "✓" : ""}</span>
								<span>${course}</span>
							</div>`
							)
							.join("")}
					</div>
				</div>

				<div class="signature-section">
					<div class="signature-box">
						<div class="signature-line"></div>
						<div>Student/Parent Signature</div>
					</div>
					<div class="signature-box">
						<div class="signature-line"></div>
						<div>Approved By</div>
					</div>
				</div>
			</div>
		</body>
		</html>
	`;
}

module.exports = router;
