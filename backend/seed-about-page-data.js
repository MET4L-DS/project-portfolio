const mongoose = require("mongoose");
const Journey = require("./models/Journey");
const Achievement = require("./models/Achievement");
const Location = require("./models/Location");
const Skill = require("./models/Skill");
require("dotenv").config();

const journeyData = [
	{
		year: "2019",
		title: "Started as a Model",
		description:
			"Beginning my journey in the entertainment industry as a professional model.",
		displayOrder: 1,
		isActive: true,
	},
	{
		year: "2020-21",
		title: "Online Competitions Era",
		description:
			"Directed Northeast Talent Hunt (2020) and Northeast Shining Star (2020). Prize distribution held at Dispur Press Club, Guwahati.",
		displayOrder: 2,
		isActive: true,
	},
	{
		year: "2022",
		title: "Expansion Year",
		description:
			"Founded Sankalp Event and Entertainment. Organized Perfect Glam Beauty Pageant Season 2, launched Goalpara Shining Star Season 1, and managed Rongmon cultural event.",
		logo: "./logo/sankalp_event_entertainment.jpg",
		logoAlt: "Sankalp Event and Entertainment Logo",
		logoDescription: "Event & Entertainment",
		displayOrder: 3,
		isActive: true,
	},
	{
		year: "2023",
		title: "Major Breakthrough",
		description:
			"Production Head for Guwahati City Fest, directed BAIDEHI runway show for CST, organized Aadibazar's Aadi The Runway Show, and continued Goalpara Shining Star Season 2.",
		displayOrder: 4,
		isActive: true,
	},
	{
		year: "2024",
		title: "Peak Performance",
		description:
			"Founded Sankalp School of Art and Skills offering 13+ skills training. Director of Bongaigaon Winter Carnival, launched Bokajan Shining Star, completed Goalpara Shining Star Season 3, and managed Style Stunner pageant.",
		logo: "./logo/sankalp_school.jpg",
		logoAlt: "Sankalp School Logo",
		logoDescription: "School of Arts",
		displayOrder: 5,
		isActive: true,
	},
	{
		year: "2025",
		title: "Current & Future",
		description:
			"Launched Aamar Xopun digital magazine celebrating Assamese culture. Organized Dudhnoi Shining Star Season 1 (Jan 2025) and continuing to expand event management and arts education initiatives.",
		logo: "./logo/aamar_xopun_logo.jpg",
		logoAlt: "Aamar Xopun Logo",
		logoDescription: "Digital Magazine",
		displayOrder: 6,
		isActive: true,
	},
];

const achievementsData = [
	{
		title: "Event Organizer",
		icon: "🏆",
		category: "Event Organizer",
		items: [
			{ name: "Northeast Talent Hunt", displayOrder: 1 },
			{ name: "Northeast Shining Star", displayOrder: 2 },
			{ name: "Perfect Glam Beauty Pageant Season 2", displayOrder: 3 },
		],
		displayOrder: 1,
		isActive: true,
	},
	{
		title: "Production Leadership",
		icon: "🎬",
		category: "Production Leadership",
		items: [
			{ name: "Production Head - Guwahati City Fest", displayOrder: 1 },
			{ name: "Show Director - Goalpara Shining Star", displayOrder: 2 },
			{
				name: "Event Manager - Fashion Carnival & Frolic",
				displayOrder: 3,
			},
		],
		displayOrder: 2,
		isActive: true,
	},
	{
		title: "Special Projects",
		icon: "🌟",
		category: "Special Projects",
		items: [
			{ name: "Sustainable Runway at Kite Festival", displayOrder: 1 },
			{ name: "Alcheringa Cultural Events", displayOrder: 2 },
			{ name: "Shrimoyee Cultural Celebration", displayOrder: 3 },
		],
		displayOrder: 3,
		isActive: true,
	},
	{
		title: "Media Ventures",
		icon: "📱",
		category: "Media Ventures",
		items: [
			{ name: "AAMAR XOPUN E-Magazine Founder", displayOrder: 1 },
			{ name: "Digital Content Creation", displayOrder: 2 },
			{ name: "Northeast Culture Promotion", displayOrder: 3 },
		],
		displayOrder: 4,
		isActive: true,
	},
];

const locationsData = [
	{
		name: "Bapujinagar Branch",
		address: "Bapujinagar, Carbon Gate",
		icon: "📍",
		displayOrder: 1,
		isActive: true,
	},
	{
		name: "Nabinnagar Branch",
		address: "LKRB Road, Nabinnagar",
		icon: "📍",
		displayOrder: 2,
		isActive: true,
	},
];

const skillsData = [
	{ name: "Art", icon: "🎨", displayOrder: 1, isActive: true },
	{ name: "Dance", icon: "💃", displayOrder: 2, isActive: true },
	{ name: "Craft", icon: "✂️", displayOrder: 3, isActive: true },
	{ name: "Acting", icon: "🎭", displayOrder: 4, isActive: true },
	{ name: "Singing", icon: "🎤", displayOrder: 5, isActive: true },
	{ name: "Zumba", icon: "🕺", displayOrder: 6, isActive: true },
	{ name: "Yoga", icon: "🧘", displayOrder: 7, isActive: true },
	{ name: "Karate", icon: "🥋", displayOrder: 8, isActive: true },
	{ name: "Makeup", icon: "💄", displayOrder: 9, isActive: true },
	{ name: "Mehendi", icon: "🎨", displayOrder: 10, isActive: true },
	{ name: "Stitching", icon: "🧵", displayOrder: 11, isActive: true },
	{ name: "Modelling", icon: "👗", displayOrder: 12, isActive: true },
	{ name: "Photography", icon: "📸", displayOrder: 13, isActive: true },
];

async function seedAboutPageData() {
	try {
		console.log("🌱 Starting About page data seeding...");

		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		// Clear existing data
		console.log("🗑️ Clearing existing data...");
		await Journey.deleteMany({});
		await Achievement.deleteMany({});
		await Location.deleteMany({});
		await Skill.deleteMany({});

		// Seed Journey data
		console.log("📅 Seeding Journey timeline...");
		await Journey.insertMany(journeyData);
		console.log(`✅ Created ${journeyData.length} journey items`);

		// Seed Achievements data
		console.log("🏆 Seeding Achievements...");
		await Achievement.insertMany(achievementsData);
		console.log(
			`✅ Created ${achievementsData.length} achievement categories`
		);

		// Seed Locations data
		console.log("📍 Seeding Locations...");
		await Location.insertMany(locationsData);
		console.log(`✅ Created ${locationsData.length} locations`);

		// Seed Skills data
		console.log("🎯 Seeding Skills...");
		await Skill.insertMany(skillsData);
		console.log(`✅ Created ${skillsData.length} skills`);

		console.log("🎉 About page data seeding completed successfully!");

		// Display summary
		console.log("\n📊 Seeding Summary:");
		console.log(`• Journey Items: ${journeyData.length}`);
		console.log(`• Achievement Categories: ${achievementsData.length}`);
		console.log(`• Locations: ${locationsData.length}`);
		console.log(`• Skills: ${skillsData.length}`);
	} catch (error) {
		console.error("❌ Error seeding About page data:", error);
		process.exit(1);
	} finally {
		await mongoose.connection.close();
		console.log("🔌 Database connection closed");
	}
}

// Run the seeding function
if (require.main === module) {
	seedAboutPageData();
}

module.exports = seedAboutPageData;
