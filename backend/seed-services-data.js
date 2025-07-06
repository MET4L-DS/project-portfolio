const mongoose = require("mongoose");
const Service = require("./models/Service");
require("dotenv").config();

const servicesData = [
	// Our Services
	{
		title: "Balloon & Theme Decor",
		icon: "🎈",
		description:
			"Give your party personality with eye-catching balloon walls, arches, table centrepieces and fully themed décor packages.",
		category: "Our Services",
		displayOrder: 1,
		isActive: true,
	},
	{
		title: "Weddings & Pre-Wedding Ceremonies",
		icon: "💍",
		items: [
			{ name: "Bride & Groom Grand Entry", displayOrder: 1 },
			{ name: "Haldi & Engagement Set-ups", displayOrder: 2 },
			{ name: "Stage Décor & Floral Draping", displayOrder: 3 },
		],
		category: "Our Services",
		displayOrder: 2,
		isActive: true,
	},
	{
		title: "Milestone Celebrations",
		icon: "🎂",
		items: [
			{ name: "Theme-Based Birthday Parties", displayOrder: 1 },
			{ name: "Baby Showers & Gender Reveals", displayOrder: 2 },
			{ name: "Anniversary Soirées", displayOrder: 3 },
		],
		category: "Our Services",
		displayOrder: 3,
		isActive: true,
	},
	{
		title: "Corporate & Institutional Events",
		icon: "🎉",
		items: [
			{ name: "Inaugurations & Launching Ceremonies", displayOrder: 1 },
			{ name: "Brand Promotions & Activations", displayOrder: 2 },
			{
				name: "College Festivals & Government Functions",
				displayOrder: 3,
			},
		],
		category: "Our Services",
		displayOrder: 4,
		isActive: true,
	},
	// Why Choose Us
	{
		title: "End-to-End Management",
		icon: "🎯",
		description:
			"From concept and design through to flawless execution, we manage every detail so you don't have to.",
		category: "Why Choose Us",
		displayOrder: 1,
		isActive: true,
	},
	{
		title: "Tailored Creativity",
		icon: "🎨",
		description:
			"We work closely with you to design décor themes, colour palettes, and ambiance that reflect your style.",
		category: "Why Choose Us",
		displayOrder: 2,
		isActive: true,
	},
	{
		title: "Professional Partnerships",
		icon: "🤝",
		description:
			"Trusted relationships with florists, lighting designers, sound engineers, caterers, and venue partners across the region.",
		category: "Why Choose Us",
		displayOrder: 3,
		isActive: true,
	},
	{
		title: "Transparent Pricing",
		icon: "💰",
		description:
			"No hidden fees—just clearly outlined packages with flexible add-ons to suit your budget.",
		category: "Why Choose Us",
		displayOrder: 4,
		isActive: true,
	},
];

async function seedServicesData() {
	try {
		console.log("🌱 Starting Services data seeding...");

		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		// Clear existing data
		console.log("🗑️ Clearing existing services data...");
		await Service.deleteMany({});

		// Seed Services data
		console.log("🎯 Seeding Services...");
		await Service.insertMany(servicesData);
		console.log(`✅ Created ${servicesData.length} services`);

		console.log("🎉 Services data seeding completed successfully!");

		// Display summary
		console.log("\n📊 Seeding Summary:");
		const ourServices = servicesData.filter(
			(s) => s.category === "Our Services"
		);
		const whyChooseUs = servicesData.filter(
			(s) => s.category === "Why Choose Us"
		);
		console.log(`• Our Services: ${ourServices.length}`);
		console.log(`• Why Choose Us: ${whyChooseUs.length}`);
		console.log(`• Total Services: ${servicesData.length}`);
	} catch (error) {
		console.error("❌ Error seeding services data:", error);
		process.exit(1);
	} finally {
		await mongoose.connection.close();
		console.log("🔌 Database connection closed");
	}
}

// Run the seeding function
if (require.main === module) {
	seedServicesData();
}

module.exports = seedServicesData;
