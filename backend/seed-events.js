const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

const sampleEvents = [
	{
		title: "NABARD Karigar Mela - Traditional Runway",
		category: "Cultural Event",
		year: "2022-2023",
		location: "Guwahati",
		description:
			"Organized Traditional Attire runway show showcasing all north-eastern tribes for National Bank of Agriculture and Rural Development.",
		importance: "high",
		image: {
			url: "/images/Nabard.jpg",
			publicId: "portfolio-events/nabard",
		},
		gallery: [
			{
				url: "/images/Aadibazaar.jpg",
				publicId: "portfolio-events/gallery/nabard_1",
			},
			{
				url: "/images/Bongaigaoo Winter Carnival.jpg",
				publicId: "portfolio-events/gallery/nabard_2",
			},
			{
				url: "/images/Northeast Talent Hunt.jpg",
				publicId: "portfolio-events/gallery/nabard_3",
			},
		],
		isActive: true,
	},
	{
		title: "Aadibazaar - Aadi The Runway Show",
		category: "Cultural Event",
		year: "Dec 15, 2023",
		location: "Guwahati",
		description:
			"Tribal beats, Local Threads: Where Tradition Meets The Catwalk - Under TRIFED showcasing north-eastern traditional attire.",
		importance: "high",
		image: {
			url: "/images/Aadibazaar.jpg",
			publicId: "portfolio-events/aadibazaar",
		},
		gallery: [
			{
				url: "/images/Fashion Frolic.jpg",
				publicId: "portfolio-events/gallery/aadi_1",
			},
			{
				url: "/images/Style Stunner.jpg",
				publicId: "portfolio-events/gallery/aadi_2",
			},
		],
		isActive: true,
	},
	{
		title: "Bongaigaon Winter Carnival - Couturiers' Euphoria",
		category: "Fashion Show",
		year: "Jan 7, 2024",
		location: "Bongaigaon",
		description:
			"Director and Organizer of this spectacular runway show at Bongaigaon Winter Carnival.",
		importance: "high",
		image: {
			url: "/images/Bongaigaoo Winter Carnival.jpg",
			publicId: "portfolio-events/bongaigaon",
		},
		gallery: [
			{
				url: "/images/Baidehi.jpg",
				publicId: "portfolio-events/gallery/bongaigaon_1",
			},
			{
				url: "/images/Bokajan Shining Star.jpg",
				publicId: "portfolio-events/gallery/bongaigaon_2",
			},
			{
				url: "/images/Dudhnoi Shining Star.jpg",
				publicId: "portfolio-events/gallery/bongaigaon_3",
			},
			{
				url: "/images/Guwahati City Fest.jpg",
				publicId: "portfolio-events/gallery/bongaigaon_4",
			},
		],
		isActive: true,
	},
];

async function seedEvents() {
	try {
		console.log("🌱 Seeding events with gallery data...");

		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to MongoDB");

		// Clear existing events
		await Event.deleteMany({});
		console.log("🗑️ Cleared existing events");

		// Insert sample events
		await Event.insertMany(sampleEvents);
		console.log(
			`✅ Successfully seeded ${sampleEvents.length} events with gallery data`
		);

		// Show created events
		const events = await Event.find({});
		console.log("\n📋 Created events:");
		events.forEach((event, index) => {
			console.log(
				`${index + 1}. ${event.title} (${
					event.gallery?.length || 0
				} gallery images)`
			);
		});
	} catch (error) {
		console.error("❌ Error seeding events:", error);
	} finally {
		await mongoose.disconnect();
		console.log("\n🔌 Disconnected from MongoDB");
		process.exit(0);
	}
}

seedEvents();
