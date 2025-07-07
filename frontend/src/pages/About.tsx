import { useState, useEffect } from "react";
import {
	journeyAPI,
	achievementsAPI,
	locationsAPI,
	skillsAPI,
} from "../services/api";

// Type definitions
interface JourneyItem {
	_id: string;
	year: string;
	title: string;
	description: string;
	logo?: string;
	logoAlt?: string;
	logoDescription?: string;
	displayOrder: number;
	isActive: boolean;
}

interface Achievement {
	_id: string;
	title: string;
	icon: string;
	category: string;
	items?: Array<{
		name: string;
		description?: string;
		displayOrder?: number;
	}>;
	displayOrder: number;
	isActive: boolean;
}

interface Location {
	_id: string;
	name: string;
	address: string;
	icon?: string;
	displayOrder: number;
	isActive: boolean;
}

interface Skill {
	_id: string;
	name: string;
	category?: string;
	icon?: string;
	displayOrder: number;
	isActive: boolean;
}

function About() {
	const [journey, setJourney] = useState<JourneyItem[]>([]);
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [skills, setSkills] = useState<Skill[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [
					journeyData,
					achievementsData,
					locationsData,
					skillsData,
				] = await Promise.all([
					journeyAPI.getAllJourneyItems(),
					achievementsAPI.getAllAchievements(),
					locationsAPI.getAllLocations(),
					skillsAPI.getAllSkills(),
				]);

				setJourney(journeyData);
				setAchievements(achievementsData);
				setLocations(locationsData);
				setSkills(skillsData);
			} catch (err) {
				console.error("Error fetching About page data:", err);
				setError("Failed to load content. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 py-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
					<p className="text-white text-xl">Loading...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-900 py-20 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-400 text-xl mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}
	return (
		<div className="min-h-screen bg-gray-900 py-12 sm:py-16 lg:py-20">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
						About{" "}
						<span className="text-yellow-400 font-bold">
							Saurav Shil
						</span>
					</h1>
					<p className="text-lg sm:text-xl text-gray-300">
						Northeast India's Event Management Expert & Arts
						Education Pioneer
					</p>
					<div className="text-base sm:text-lg text-green-300 mt-2 italic">
						"Your Vision, Our Spectacle"
					</div>
				</div>
				{/* Mission & Vision */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
					<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6">
							My Mission
						</h2>
						<p className="text-gray-300 text-base sm:text-lg leading-relaxed">
							To preserve and showcase Northeast India's rich
							tribal heritage through world-class events while
							nurturing the next generation of artists through
							comprehensive education. I believe in creating
							platforms where tradition meets modernity.
						</p>
					</div>

					<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6">
							My Vision
						</h2>
						<p className="text-gray-300 text-base sm:text-lg leading-relaxed">
							To establish Northeast India as a premier
							destination for cultural events and arts education.
							I envision a future where our tribal traditions are
							celebrated globally while local artists have
							world-class training facilities.
						</p>
					</div>
				</div>
				{/* Experience Timeline */}
				<div className="mb-12 sm:mb-16 lg:mb-20">
					<h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Journey
						</span>
					</h2>
					<div className="space-y-4 sm:space-y-6 lg:space-y-8">
						{/* Journey Timeline */}
						<div className="space-y-4 sm:space-y-6">
							{journey.map((item) => (
								<div
									key={item._id}
									className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
								>
									<div className="bg-yellow-400 text-black rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 mx-auto sm:mx-0">
										{item.year}
									</div>
									<div className="flex-1 text-center sm:text-left">
										<h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 sm:mb-3">
											{item.title}
										</h3>
										<p className="text-gray-300 leading-relaxed text-sm sm:text-base">
											{item.description}
										</p>
									</div>
									{item.logo && (
										<div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-3 sm:p-4 rounded-xl border border-yellow-400/40 shadow-xl flex-shrink-0 flex flex-col items-center mx-auto sm:mx-0">
											<img
												src={item.logo}
												alt={
													item.logoAlt ||
													`${item.title} Logo`
												}
												className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-lg shadow-lg mb-2"
											/>
											{item.logoDescription && (
												<p className="text-xs text-yellow-400 text-center">
													{item.logoDescription}
												</p>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Major Achievements */}
				<div className="mb-12 sm:mb-16 lg:mb-20">
					<h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
						Major{" "}
						<span className="text-yellow-400 font-bold">
							Achievements
						</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
						{achievements.map((achievement) => (
							<div
								key={achievement._id}
								className="p-4 sm:p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
							>
								<h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4">
									{achievement.icon} {achievement.title}
								</h3>
								{achievement.items &&
								achievement.items.length > 0 ? (
									<ul className="text-gray-300 space-y-2">
										{achievement.items.map(
											(item, index) => (
												<li
													key={index}
													className="flex items-start"
												>
													<span className="text-yellow-400 mr-2 mt-1">
														•
													</span>
													<div>
														<span className="font-medium text-sm sm:text-base">
															{item.name}
														</span>
														{item.description && (
															<p className="text-sm text-gray-400 mt-1">
																{
																	item.description
																}
															</p>
														)}
													</div>
												</li>
											)
										)}
									</ul>
								) : (
									<p className="text-gray-300 text-sm sm:text-base">
										No items listed for this achievement
										category.
									</p>
								)}
							</div>
						))}
					</div>
				</div>
				{/* School Section */}
				<div className="mb-12 sm:mb-16 lg:mb-20">
					<h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 sm:mb-4">
						<span className="text-yellow-400 font-bold">
							Sankalp School
						</span>{" "}
						of Art and Skills
					</h2>
					<p className="text-center text-lg sm:text-xl text-green-300 mb-8 sm:mb-12 italic">
						"Confidence Starts Here"
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">
								Our Locations
							</h3>
							<div className="space-y-3 sm:space-y-4">
								{locations.length > 0 ? (
									locations.map((location) => (
										<div
											key={location._id}
											className="flex items-start"
										>
											<span className="text-yellow-400 mr-2 mt-1">
												{location.icon || "📍"}
											</span>
											<span className="text-gray-300 text-sm sm:text-base">
												{location.name} -{" "}
												{location.address}
											</span>
										</div>
									))
								) : (
									<p className="text-gray-400 text-sm sm:text-base">
										No locations available at the moment.
									</p>
								)}
							</div>
						</div>

						<div className="p-4 sm:p-6 lg:p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">
								{skills.length}+ Skills We Teach
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
								{skills.length > 0 ? (
									skills.map((skill) => (
										<div
											key={skill._id}
											className="flex items-center"
										>
											<span className="text-yellow-400 mr-2">
												{skill.icon || "•"}
											</span>
											<span className="text-sm sm:text-base">
												{skill.name}
											</span>
										</div>
									))
								) : (
									<p className="text-gray-400 col-span-2 text-sm sm:text-base">
										No skills available at the moment.
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
				{/* Call to Action */}
				<div className="text-center">
					<h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
						Let's Create Something Amazing Together
					</h3>
					<p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
						Ready to bring your event vision to life? Let's discuss
						your next big project.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
						<a
							href="/contact"
							className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
						>
							Get In Touch
						</a>
						<a
							href="/magazine"
							rel="noopener noreferrer"
							className="border-2 border-blue-400 text-blue-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-black transition-all transform hover:scale-105 text-sm sm:text-base"
						>
							Read Magazine
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;
