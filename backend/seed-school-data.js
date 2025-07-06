const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Location = require("./models/Location");
const Skill = require("./models/Skill");

// Load environment variables
dotenv.config();

const seedData = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");

		// Clear existing data
		await Location.deleteMany({});
		await Skill.deleteMany({});
		console.log("Cleared existing data");

		// Seed Locations
		const locations = [
			{
				name: "Carbon Gate",
				address: "Bapujinagar, Carbon Gate\nGuwahati, Assam",
				icon: "📍",
				displayOrder: 1,
				isActive: true,
			},
			{
				name: "Nabinnagar",
				address: "LKRB Road, Nabinnagar\nGuwahati, Assam",
				icon: "📍",
				displayOrder: 2,
				isActive: true,
			},
		];

		const createdLocations = await Location.insertMany(locations);
		console.log(`Created ${createdLocations.length} locations`);

		// Seed Skills
		const skills = [
			{ name: "Art", icon: "🎨", displayOrder: 1, isActive: true },
			{ name: "Dance", icon: "💃", displayOrder: 2, isActive: true },
			{ name: "Craft", icon: "🧵", displayOrder: 3, isActive: true },
			{ name: "Acting", icon: "🎭", displayOrder: 4, isActive: true },
			{ name: "Singing", icon: "🎤", displayOrder: 5, isActive: true },
			{ name: "Zumba", icon: "🕺", displayOrder: 6, isActive: true },
			{ name: "Yoga", icon: "🧘", displayOrder: 7, isActive: true },
			{ name: "Karate", icon: "🥋", displayOrder: 8, isActive: true },
			{ name: "Makeup", icon: "💄", displayOrder: 9, isActive: true },
			{ name: "Mehendi", icon: "✋", displayOrder: 10, isActive: true },
			{ name: "Stitching", icon: "👗", displayOrder: 11, isActive: true },
			{ name: "Modelling", icon: "📸", displayOrder: 12, isActive: true },
			{
				name: "Photography",
				icon: "📷",
				displayOrder: 13,
				isActive: true,
			},
		];

		const createdSkills = await Skill.insertMany(skills);
		console.log(`Created ${createdSkills.length} skills`);

		console.log("School data seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding school data:", error);
		process.exit(1);
	}
};

seedData();
