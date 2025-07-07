const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Profile = require("./models/Profile");
const { connectDB } = require("./config/database");

// Load environment variables
dotenv.config();

const seedProfileData = async () => {
	try {
		console.log("Connecting to database...");
		await connectDB();
		console.log("Connected successfully!");

		// Check if profile already exists
		const existingProfile = await Profile.findOne({});
		if (existingProfile) {
			console.log("Profile data already exists!");
			return;
		}

		// Create default profile
		const profile = new Profile({
			name: "SAURAV SHIL",
			title: "Event Management & Media Pioneer",
			tagline: "Your Vision, Our Spectacle",
			missionStatement:
				"Transforming Northeast India's cultural landscape through world-class events, traditional runway shows, and comprehensive arts education. Celebrating tribal heritage while nurturing the next generation of artists and performers.",
			profilePicture: {
				url: "/profile-picture-2.jpg",
				publicId: null,
			},
			organizationLogos: {
				eventLogo: {
					url: "./logo/sankalp_event_entertainment.jpg",
					publicId: null,
				},
				schoolLogo: {
					url: "./logo/sankalp_school.jpg",
					publicId: null,
				},
			},
			stats: {
				majorEvents: 15,
				fashionShows: 8,
				skillsTaught: 13,
				yearsExperience: 6,
			},
			isActive: true,
		});

		await profile.save();
		console.log("Profile data seeded successfully!");
	} catch (error) {
		console.error("Error seeding profile data:", error);
	} finally {
		mongoose.connection.close();
		console.log("Database connection closed.");
	}
};

// Run the seed function
seedProfileData();
