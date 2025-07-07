const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, getConnectionStatus } = require("./config/database");
const { serverlessLogger, errorHandler } = require("./middleware/serverless");

// Import routes
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const magazineRoutes = require("./routes/magazines");
const studentRoutes = require("./routes/students");
const candidateRoutes = require("./routes/candidates");
const locationRoutes = require("./routes/locations");
const skillRoutes = require("./routes/skills");
const journeyRoutes = require("./routes/journey");
const achievementRoutes = require("./routes/achievements");
const serviceRoutes = require("./routes/services");
const galleryRoutes = require("./routes/gallery");
const profileRoutes = require("./routes/profile");

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
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
	maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serverless logging and error handling
app.use(serverlessLogger);

// Middleware to ensure DB connection on each request (for serverless)
app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (error) {
		console.error(
			"❌ Database connection failed for request:",
			error.message
		);
		res.status(503).json({
			error: "Database connection failed",
			message:
				"Unable to connect to the database. Please try again later.",
			timestamp: new Date().toISOString(),
			details:
				process.env.NODE_ENV === "development"
					? error.message
					: undefined,
		});
	}
});

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/profile", profileRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
	const status = getConnectionStatus();
	const mongoStates = {
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	};

	res.json({
		message: "Portfolio Backend API is running!",
		timestamp: new Date().toISOString(),
		mongodb: {
			status: mongoStates[status.readyState] || "unknown",
			readyState: status.readyState,
			host: status.host || "not-connected",
			name: status.name || "not-connected",
			isConnected: status.isConnected,
			serverless:
				process.env.VERCEL === "1" ||
				process.env.NODE_ENV === "production",
		},
		environment: process.env.NODE_ENV || "development",
		cors: {
			enabled: true,
			origin: req.headers.origin || "no-origin",
			allowCredentials: true,
		},
	});
});

// Database status endpoint for debugging
app.get("/api/db-status", async (req, res) => {
	try {
		const status = getConnectionStatus();
		const mongoStates = {
			0: "disconnected",
			1: "connected",
			2: "connecting",
			3: "disconnecting",
		};

		// Attempt to ping the database
		let pingResult = null;
		let pingError = null;
		let dbStats = null;

		try {
			if (status.readyState === 1) {
				await mongoose.connection.db.admin().ping();
				pingResult = "success";
				// Get database stats
				dbStats = await mongoose.connection.db.stats();
			} else {
				pingResult = "skipped - not connected";
			}
		} catch (error) {
			pingError = error.message;
			pingResult = "failed";
		}

		// Get connection info
		const connectionInfo = {
			readyState: status.readyState,
			status: mongoStates[status.readyState] || "unknown",
			host: status.host || "not-available",
			name: status.name || "not-available",
			isConnected: status.isConnected,
			ping: {
				result: pingResult,
				error: pingError,
				timestamp: new Date().toISOString(),
			},
			stats: dbStats
				? {
						database: dbStats.db,
						collections: dbStats.collections,
						dataSize: dbStats.dataSize,
						indexSize: dbStats.indexSize,
				  }
				: null,
		};

		// Get environment info
		const envInfo = {
			nodeEnv: process.env.NODE_ENV || "development",
			isVercel: process.env.VERCEL === "1",
			hasMongoUri: !!process.env.MONGODB_URI,
			mongoUriPreview:
				process.env.MONGODB_URI?.substring(0, 50) + "..." || "not-set",
			port: process.env.PORT || "5000",
		};

		res.json({
			message: "Database status check",
			timestamp: new Date().toISOString(),
			connection: connectionInfo,
			environment: envInfo,
			troubleshooting: {
				commonIssues: [
					"Check if MONGODB_URI environment variable is set correctly",
					"Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)",
					"Confirm database user has read/write permissions",
					"Check MongoDB Atlas cluster is running and accessible",
					"Verify connection string format and credentials",
				],
				documentation:
					"See MONGODB_TROUBLESHOOTING.md for detailed help",
			},
		});
	} catch (error) {
		const status = getConnectionStatus();
		res.status(500).json({
			error: "Database status check failed",
			message: error.message,
			timestamp: new Date().toISOString(),
			connection: {
				readyState: status.readyState,
				isConnected: status.isConnected,
			},
		});
	}
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

// Middleware to ensure DB connection on each request (for serverless)
app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (error) {
		console.error(
			"❌ Database connection failed for request:",
			error.message
		);
		res.status(503).json({
			error: "Database connection failed",
			message:
				"Unable to connect to the database. Please try again later.",
			timestamp: new Date().toISOString(),
			details:
				process.env.NODE_ENV === "development"
					? error.message
					: undefined,
		});
	}
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server (for local development)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
	const startServer = async () => {
		try {
			await connectDB();
			console.log("✅ Database connection established during startup");
		} catch (error) {
			console.error(
				"❌ Failed to connect to database during startup:",
				error.message
			);
			console.error(
				"🔄 Server will start but database operations may fail"
			);
		}

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
			console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
			console.log(`🔍 DB status: http://localhost:${PORT}/api/db-status`);
			if (process.env.NODE_ENV === "development") {
				console.log(
					`🔐 Admin Panel: http://localhost:3000/admin/login`
				);
			}
		});
	};

	startServer();
} else {
	// In production (Vercel), just ensure we export the app
	console.log("🚀 Serverless function ready for deployment");
	console.log("🔗 Database connections will be established per request");
}

module.exports = app;
