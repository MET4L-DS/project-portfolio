const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

async function getEventIds() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to MongoDB");

		const events = await Event.find({});
		console.log("\n📋 Events in database:");
		events.forEach((event, index) => {
			console.log(
				`${index + 1}. ID: ${event._id}, Title: ${event.title}`
			);
		});
	} catch (error) {
		console.error("❌ Error:", error);
	} finally {
		await mongoose.disconnect();
		console.log("\n🔌 Disconnected from MongoDB");
		process.exit(0);
	}
}

getEventIds();
