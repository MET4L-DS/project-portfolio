const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import routes
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const magazineRoutes = require("./routes/magazines");
const studentRoutes = require("./routes/students");
const candidateRoutes = require("./routes/candidates");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error(
		"Missing required environment variables:",
		missingEnvVars.join(", ")
	);
	console.error("Please check your .env file");
	process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (mobile apps, Postman, etc.)
		if (!origin) return callback(null, true);

		// Get additional origins from environment variable
		const additionalOrigins = process.env.CORS_ORIGINS
			? process.env.CORS_ORIGINS.split(",").map((url) => url.trim())
			: [];

		const allowedOrigins = [
			// Development URLs
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5173",

			// Add origins from environment variable
			...additionalOrigins,

			// Production URLs - Add your actual production domain here
			"https://your-production-domain.com",
			"https://www.your-production-domain.com",

			// Vercel/Netlify patterns (update with your actual deployment URLs)
			/^https:\/\/.*\.vercel\.app$/,
			/^https:\/\/.*\.netlify\.app$/,
		];

		// Check if origin matches any allowed pattern
		const isAllowed = allowedOrigins.some((allowedOrigin) => {
			if (typeof allowedOrigin === "string") {
				return origin === allowedOrigin;
			} else if (allowedOrigin instanceof RegExp) {
				return allowedOrigin.test(origin);
			}
			return false;
		});

		if (isAllowed) {
			callback(null, true);
		} else {
			console.log("Blocked by CORS:", origin);
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, // Allow cookies and authorization headers
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
	maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		message: "Portfolio Backend API is running!",
		timestamp: new Date().toISOString(),
		mongodb:
			mongoose.connection.readyState === 1 ? "connected" : "disconnected",
		environment: process.env.NODE_ENV || "development",
		cors: {
			enabled: true,
			origin: req.headers.origin || "no-origin",
			allowCredentials: true,
		},
	});
});

// Test endpoint for debugging
app.get("/api/test", (req, res) => {
	res.json({
		message: "Test endpoint working",
		envVars: {
			hasMongoUri: !!process.env.MONGODB_URI,
			hasJwtSecret: !!process.env.JWT_SECRET,
			hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
			hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
			hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
		},
	});
});

// MongoDB connection with fallback
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to MongoDB Atlas");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error.message);
		console.error("🔄 Server will continue without database connection");
		console.error("📝 Please check your MONGODB_URI in .env file");
		console.error(
			"🌐 Visit: https://cloud.mongodb.com/ to set up MongoDB Atlas"
		);
	}
};

// Start server
const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`🚀 Server is running on port ${PORT}`);
		console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
		if (process.env.NODE_ENV === "development") {
			console.log(`🔐 Admin Panel: http://localhost:3000/admin/login`);
		}
	});
};

startServer();

module.exports = app;
