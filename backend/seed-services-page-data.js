const mongoose = require("mongoose");
const Service = require("./models/Service");
require("dotenv").config();

// Services data from the original Services.tsx page
const servicesData = [
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
];

const whyChooseData = [
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

async function seedServicesPageData() {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB Atlas");

		// Clear existing services page data
		await Service.deleteMany({
			category: { $in: ["Our Services", "Why Choose Us"] },
		});
		console.log("Cleared existing services page data");

		// Insert services data
		const services = await Service.insertMany(servicesData);
		console.log(`✅ Inserted ${services.length} Our Services items`);

		// Insert why choose us data
		const whyChoose = await Service.insertMany(whyChooseData);
		console.log(`✅ Inserted ${whyChoose.length} Why Choose Us items`);

		console.log("🎉 Services page data seeding completed successfully!");

		// Display summary
		console.log("\n📊 Summary:");
		console.log(`- Our Services: ${services.length} items`);
		console.log(`- Why Choose Us: ${whyChoose.length} items`);
		console.log(`- Total: ${services.length + whyChoose.length} items`);
	} catch (error) {
		console.error("❌ Error seeding services page data:", error);
	} finally {
		// Close the connection
		await mongoose.connection.close();
		console.log("Connection closed");
	}
}

// Run the seed function
seedServicesPageData();
