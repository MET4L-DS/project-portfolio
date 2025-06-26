const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed!"), false);
		}
	},
});

// Upload image to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
	return new Promise((resolve, reject) => {
		const uploadOptions = {
			folder: "portfolio-events",
			transformation: [
				{ width: 800, height: 600, crop: "fill", quality: "auto" },
				{ fetch_format: "auto" },
			],
			...options,
		};

		cloudinary.uploader
			.upload_stream(uploadOptions, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve({
						url: result.secure_url,
						publicId: result.public_id,
					});
				}
			})
			.end(buffer);
	});
};

// Delete image from Cloudinary
const deleteFromCloudinary = (publicId) => {
	return cloudinary.uploader.destroy(publicId);
};

module.exports = {
	cloudinary,
	upload,
	uploadToCloudinary,
	deleteFromCloudinary,
};
