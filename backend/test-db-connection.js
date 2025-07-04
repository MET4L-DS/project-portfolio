const dotenv = require("dotenv");
const {
	connectDB,
	getConnectionStatus,
	disconnectDB,
} = require("./config/database");

// Load environment variables
dotenv.config();

async function testConnection() {
	console.log("🧪 Testing MongoDB connection...");
	console.log("🌐 Environment:", process.env.NODE_ENV || "development");
	console.log("🔗 Has MongoDB URI:", !!process.env.MONGODB_URI);

	try {
		console.log("\n1️⃣ Testing initial connection...");
		await connectDB();

		let status = getConnectionStatus();
		console.log("📊 Connection status:", status);

		console.log("\n2️⃣ Testing connection reuse...");
		await connectDB(); // Should reuse existing connection

		status = getConnectionStatus();
		console.log("📊 Connection status:", status);

		console.log("\n3️⃣ Testing database operations...");
		const mongoose = require("mongoose");
		const result = await mongoose.connection.db.admin().ping();
		console.log("🏓 Ping result:", result);

		const stats = await mongoose.connection.db.stats();
		console.log("📈 Database stats:", {
			database: stats.db,
			collections: stats.collections,
			dataSize: stats.dataSize,
			indexSize: stats.indexSize,
		});

		console.log("\n✅ All tests passed!");
	} catch (error) {
		console.error("\n❌ Test failed:", error.message);
		console.error("🔍 Error details:", {
			name: error.name,
			code: error.code,
			codeName: error.codeName,
		});
	} finally {
		console.log("\n🔄 Cleaning up...");
		await disconnectDB();
		console.log("✅ Test complete");
		process.exit(0);
	}
}

// Run the test
testConnection();
