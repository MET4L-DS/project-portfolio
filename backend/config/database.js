const mongoose = require("mongoose");

// Global connection state for serverless
let isConnected = false;

const connectDB = async () => {
	// If already connected, return
	if (isConnected && mongoose.connection.readyState === 1) {
		console.log("📡 Using existing MongoDB connection");
		return mongoose.connection;
	}

	// If connection is in progress, wait for it
	if (mongoose.connection.readyState === 2) {
		console.log("⏳ MongoDB connection in progress, waiting...");
		return new Promise((resolve, reject) => {
			mongoose.connection.once("connected", () => {
				isConnected = true;
				resolve(mongoose.connection);
			});
			mongoose.connection.once("error", reject);
		});
	}

	try {
		// Serverless-optimized connection options
		const connectionOptions = {
			// Aggressive timeouts for serverless
			serverSelectionTimeoutMS: 10000, // 10 seconds
			socketTimeoutMS: 45000, // 45 seconds
			connectTimeoutMS: 10000, // 10 seconds
			// Connection pooling for serverless
			maxPoolSize: 5, // Maintain up to 5 socket connections
			minPoolSize: 1, // Maintain at least 1 socket connection
			maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
			// Additional serverless optimizations
			retryWrites: true,
		};

		console.log("🔄 Attempting MongoDB connection...");
		console.log("🌐 MongoDB URI exists:", !!process.env.MONGODB_URI);

		if (!process.env.MONGODB_URI) {
			throw new Error("MONGODB_URI environment variable is not set");
		}

		// Configure Mongoose for serverless (disable buffering)
		mongoose.set("bufferCommands", false);

		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
		isConnected = true;
		console.log("✅ Connected to MongoDB Atlas");

		// Test the connection
		await mongoose.connection.db.admin().ping();
		console.log("✅ MongoDB ping successful");

		// Handle connection events
		mongoose.connection.on("connected", () => {
			console.log("✅ Mongoose connected to MongoDB");
			isConnected = true;
		});

		mongoose.connection.on("error", (err) => {
			console.error("❌ Mongoose connection error:", err);
			isConnected = false;
		});

		mongoose.connection.on("disconnected", () => {
			console.log("🔌 Mongoose disconnected");
			isConnected = false;
		});

		// Graceful shutdown handling
		process.on("SIGINT", async () => {
			try {
				await mongoose.connection.close();
				console.log(
					"📴 MongoDB connection closed through app termination"
				);
				process.exit(0);
			} catch (error) {
				console.error("❌ Error closing MongoDB connection:", error);
				process.exit(1);
			}
		});

		return mongoose.connection;
	} catch (error) {
		isConnected = false;
		console.error("❌ MongoDB connection error:", error.message);
		console.error("🔍 Error details:", {
			name: error.name,
			code: error.code,
			codeName: error.codeName,
		});

		// More specific error messages
		if (error.message.includes("ENOTFOUND")) {
			console.error(
				"🌐 DNS resolution failed - check your MongoDB URI hostname"
			);
		} else if (error.message.includes("authentication failed")) {
			console.error(
				"🔐 Authentication failed - check your username/password"
			);
		} else if (error.message.includes("timeout")) {
			console.error(
				"⏱️ Connection timeout - check network connectivity and firewall settings"
			);
		} else if (
			error.message.includes("IP") ||
			error.message.includes("whitelist")
		) {
			console.error(
				"🚫 IP not whitelisted - add 0.0.0.0/0 to MongoDB Atlas Network Access"
			);
		}

		console.error("🔄 Request will fail without database connection");
		console.error(
			"📝 Please check your MONGODB_URI and MongoDB Atlas settings"
		);
		console.error(
			"🌐 Visit: https://cloud.mongodb.com/ to configure your cluster"
		);
		throw error; // Re-throw for serverless error handling
	}
};

// Get connection status
const getConnectionStatus = () => {
	return {
		isConnected,
		readyState: mongoose.connection.readyState,
		host: mongoose.connection.host,
		name: mongoose.connection.name,
	};
};

// Disconnect (mainly for testing)
const disconnectDB = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.close();
		isConnected = false;
		console.log("📴 MongoDB connection closed");
	}
};

module.exports = {
	connectDB,
	getConnectionStatus,
	disconnectDB,
	isConnected: () => isConnected,
};
