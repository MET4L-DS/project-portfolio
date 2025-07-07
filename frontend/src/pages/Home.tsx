import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { profileAPI } from "../services/api";

interface ProfileData {
	name: string;
	title: string;
	tagline: string;
	missionStatement: string;
	profilePicture: {
		url: string;
		publicId: string | null;
	};
	organizationLogos: {
		eventLogo: {
			url: string;
			publicId: string | null;
		};
		schoolLogo: {
			url: string;
			publicId: string | null;
		};
	};
	stats: {
		majorEvents: number;
		fashionShows: number;
		skillsTaught: number;
		yearsExperience: number;
	};
}

function Home() {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await profileAPI.getProfile();
				setProfile(data);
			} catch (error) {
				console.error("Error fetching profile:", error);
				// Use default data if fetch fails
				setProfile({
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
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-red-600">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
					<p className="text-white text-xl">Loading...</p>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-red-600">
				<div className="text-center">
					<p className="text-white text-xl">
						Unable to load profile data
					</p>
				</div>
			</div>
		);
	}
	return (
		<>
			{/* Hero Section */}
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-red-600 py-4 sm:py-8">
				<div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
					{/* Profile Picture */}
					<div className="mb-6 sm:mb-8">
						<img
							src={profile.profilePicture.url}
							alt={`${profile.name} - Event Management Expert`}
							className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl object-cover"
						/>
					</div>
					{/* Name & Title */}
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
						<span className="text-yellow-400">{profile.name}</span>
						<br />
						<span className="text-lg sm:text-xl md:text-2xl lg:text-4xl">
							{profile.title}
						</span>
					</h1>
					{/* Organization */}
					<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-300 mb-4 sm:mb-6 font-light px-2">
						Founder of{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp Event and Entertainment
						</span>{" "}
						&{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp School of Art and Skills
						</span>
					</h2>
					{/* Organization Logos */}
					<div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-4 sm:mb-6">
						<div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-4 sm:p-6 rounded-xl border border-yellow-400/40 shadow-xl flex flex-col items-center w-full sm:w-auto">
							<img
								src={profile.organizationLogos.eventLogo.url}
								alt="Sankalp Event and Entertainment Logo"
								className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg shadow-lg mb-2 sm:mb-3"
							/>
							<p className="text-xs sm:text-sm text-yellow-400 text-center font-semibold">
								Event & Entertainment
							</p>
						</div>
						<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-4 sm:p-6 rounded-xl border border-purple-400/40 shadow-xl flex flex-col items-center w-full sm:w-auto">
							<img
								src={profile.organizationLogos.schoolLogo.url}
								alt="Sankalp School Logo"
								className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg shadow-lg mb-2 sm:mb-3"
							/>
							<p className="text-xs sm:text-sm text-purple-400 text-center font-semibold">
								School of Art & Skills
							</p>
						</div>
					</div>
					{/* Tagline */}
					<div className="text-lg sm:text-xl md:text-2xl text-green-300 mb-4 sm:mb-6 font-medium italic">
						"{profile.tagline}"
					</div>
					{/* Mission Statement */}
					<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
						{profile.missionStatement}
					</p>
					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-8 sm:mb-12 px-2">
						<Link
							to="/events"
							className="bg-yellow-400 text-black px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
						>
							View Our Events
						</Link>
						<Link
							to="/school"
							className="border-2 border-purple-400 text-purple-400 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-400 hover:text-black transition-all transform hover:scale-105 text-sm sm:text-base"
						>
							Explore School
						</Link>
						<Link
							to="/magazine"
							className="border-2 border-blue-400 text-blue-400 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-black transition-all transform hover:scale-105 text-sm sm:text-base"
						>
							Read Magazine
						</Link>
						<Link
							to="/about"
							className="border-2 border-yellow-400 text-yellow-400 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 text-sm sm:text-base"
						>
							My Journey
						</Link>
						<Link
							to="/contact"
							className="border-2 border-green-400 text-green-400 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105 text-sm sm:text-base"
						>
							Contact Us
						</Link>
					</div>
					{/* Impact Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-5xl mx-auto px-2">
						<div className="text-center">
							<div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								{profile.stats.majorEvents}+
							</div>
							<p className="text-gray-300 text-sm sm:text-base lg:text-lg">
								Major Events Organized
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								{profile.stats.fashionShows}
							</div>
							<p className="text-gray-300 text-sm sm:text-base lg:text-lg">
								Fashion Show Seasons
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								{profile.stats.skillsTaught}+
							</div>
							<p className="text-gray-300 text-sm sm:text-base lg:text-lg">
								Skills Taught at School
							</p>
						</div>
						<div className="text-center">
							<div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								{profile.stats.yearsExperience}+
							</div>
							<p className="text-gray-300 text-sm sm:text-base lg:text-lg">
								Years Experience
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Preview Section */}
			<div className="py-12 sm:py-16 lg:py-20 bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Four Pillars
						</span>
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
						{/* Event Management */}
						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
								🎭
							</div>
							<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">
								Event Management
							</h4>
							<p className="text-gray-300 text-sm sm:text-base">
								Specialized in traditional runway shows, fashion
								events, and cultural celebrations showcasing
								Northeast India's tribal heritage and modern
								fashion.
							</p>
						</div>
						{/* Arts Education */}
						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
								🎨
							</div>
							<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">
								Arts Education
							</h4>
							<p className="text-gray-300 text-sm sm:text-base">
								Sankalp School of Art and Skills offers
								comprehensive training in 13+ disciplines from
								traditional arts to modern skills like
								photography and makeup.
							</p>
						</div>
						{/* Cultural Preservation */}
						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
								🏛️
							</div>
							<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">
								Cultural Preservation
							</h4>
							<p className="text-gray-300 text-sm sm:text-base">
								Promoting Northeast tribal traditions through
								runway shows featuring traditional attire and
								supporting local artisans through various
								cultural events.
							</p>
						</div>
						{/* Digital Magazine */}
						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
								📖
							</div>
							<h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">
								Digital Magazine
							</h4>
							<p className="text-gray-300 text-sm sm:text-base">
								"Aamar Xopun" celebrates Assamese culture
								through digital storytelling, featuring
								literature, community stories, and cultural
								insights for modern audiences.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
