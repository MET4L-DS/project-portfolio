const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
	try {
		console.log("Testing MongoDB connection...");
		console.log("Connection string:", process.env.MONGODB_URI);

		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Successfully connected to MongoDB!");

		// Test creating a simple document
		const testSchema = new mongoose.Schema({
			name: String,
			createdAt: { type: Date, default: Date.now },
		});

		const TestModel = mongoose.model("Test", testSchema);
		const testDoc = new TestModel({ name: "Connection Test" });
		await testDoc.save();
		console.log("✅ Successfully created test document!");

		await TestModel.deleteOne({ _id: testDoc._id });
		console.log("✅ Successfully deleted test document!");
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		console.error("Full error:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
		process.exit(0);
	}
}

testConnection();
