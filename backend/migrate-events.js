const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio"
);

// Event schema for migration
const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.model("Event", eventSchema);

async function migrateEvents() {
	try {
		console.log("🔄 Starting event migration...");

		// Find all events that have 'year' field but no 'eventDate' field
		const eventsToMigrate = await Event.find({
			year: { $exists: true },
			eventDate: { $exists: false },
		});

		console.log(`📋 Found ${eventsToMigrate.length} events to migrate`);

		for (const event of eventsToMigrate) {
			let eventDate;

			// Try to parse the year field
			if (event.year) {
				// If it's just a year (e.g., "2024"), default to January 1st
				if (/^\d{4}$/.test(event.year)) {
					eventDate = new Date(`${event.year}-01-01`);
				}
				// If it's a month and year (e.g., "Jan 2024", "January 2024")
				else if (/^[A-Za-z]{3,9}\s+\d{4}$/.test(event.year)) {
					eventDate = new Date(event.year);
				}
				// If it's already a date string
				else {
					eventDate = new Date(event.year);
				}
			}

			// If we couldn't parse it or it's invalid, default to current date
			if (!eventDate || isNaN(eventDate.getTime())) {
				console.log(
					`⚠️  Could not parse date for event "${event.title}" with year "${event.year}". Using current date.`
				);
				eventDate = new Date();
			}

			// Update the event
			await Event.updateOne(
				{ _id: event._id },
				{
					$set: { eventDate: eventDate },
					$unset: { year: 1 }, // Remove the old year field
				}
			);

			console.log(
				`✅ Migrated event: "${event.title}" -> ${
					eventDate.toISOString().split("T")[0]
				}`
			);
		}

		console.log("🎉 Migration completed successfully!");
	} catch (error) {
		console.error("❌ Migration failed:", error);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
}

// Run migration
migrateEvents();
