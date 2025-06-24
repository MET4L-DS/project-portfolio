import { Link } from "react-router-dom";

function Home() {
	return (
		<>
			{/* Hero Section */}
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-red-600 py-8">
				<div className="text-center px-8 max-w-6xl mx-auto">
					{/* Profile Picture */}
					<div className="mb-8">
						<img
							src="/profile-picture.jpg"
							alt="Saurav Shil - Event Management Expert"
							className="w-56 h-56 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl object-cover"
						/>
					</div>{" "}
					{/* Name & Title */}
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
						<span className="text-yellow-400">SAURAV SHIL</span>
						<br />
						Event Management & Media Pioneer
					</h1>{" "}
					{/* Organization */}
					<h2 className="text-2xl md:text-3xl text-yellow-300 mb-6 font-light">
						Founder of{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp Event and Entertainment
						</span>{" "}
						&{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp School of Art and Skills
						</span>
					</h2>{" "}
					{/* Organization Logos */}
					<div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-6">
						<div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-6 rounded-xl border border-yellow-400/40 shadow-xl flex flex-col items-center">
							<img
								src="./logo/sankalp_event_entertainment.jpg"
								alt="Sankalp Event and Entertainment Logo"
								className="h-20 w-20 object-cover rounded-lg shadow-lg mb-3"
							/>
							<p className="text-sm text-yellow-400 text-center font-semibold">
								Event & Entertainment
							</p>
						</div>
						<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-6 rounded-xl border border-purple-400/40 shadow-xl flex flex-col items-center">
							<img
								src="./logo/sankalp_school.jpg"
								alt="Sankalp School Logo"
								className="h-20 w-20 object-cover rounded-lg shadow-lg mb-3"
							/>
							<p className="text-sm text-purple-400 text-center font-semibold">
								School of Art & Skills
							</p>
						</div>
					</div>
					{/* Tagline */}
					<div className="text-xl md:text-2xl text-green-300 mb-6 font-medium italic">
						"Your Vision, Our Spectacle"
					</div>{" "}
					{/* Mission Statement */}
					<p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
						Transforming Northeast India's cultural landscape
						through world-class events, traditional runway shows,
						and comprehensive arts education. Celebrating tribal
						heritage while nurturing the next generation of artists
						and performers.
					</p>{" "}
					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Link
							to="/events"
							className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
						>
							View Our Events
						</Link>
						<Link
							to="/school"
							className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-lg font-semibold hover:bg-purple-400 hover:text-black transition-all transform hover:scale-105"
						>
							Explore School
						</Link>
						<Link
							to="/magazine"
							className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-black transition-all transform hover:scale-105"
						>
							Read Magazine
						</Link>
						<Link
							to="/about"
							className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105"
						>
							My Journey
						</Link>
						<Link
							to="/contact"
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							Contact Us
						</Link>
					</div>
					{/* Impact Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								15+
							</div>
							<p className="text-gray-300 text-lg">
								Major Events Organized
							</p>
						</div>
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								8
							</div>
							<p className="text-gray-300 text-lg">
								Beauty Pageant Seasons
							</p>
						</div>
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								13+
							</div>
							<p className="text-gray-300 text-lg">
								Skills Taught at School
							</p>
						</div>
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								6+
							</div>
							<p className="text-gray-300 text-lg">
								Years Experience
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Preview Section */}
			<div className="py-20 bg-gray-900">
				{" "}
				<div className="max-w-7xl mx-auto px-8">
					<h3 className="text-4xl font-bold text-center text-white mb-12">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Four Pillars
						</span>
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* Event Management */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🎭</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Event Management
							</h4>
							<p className="text-gray-300">
								Specialized in traditional runway shows, beauty
								pageants, and cultural festivals showcasing
								Northeast India's tribal heritage and modern
								fashion.
							</p>
						</div>
						{/* Arts Education */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🎨</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Arts Education
							</h4>
							<p className="text-gray-300">
								Sankalp School of Art and Skills offers
								comprehensive training in 13+ disciplines from
								traditional arts to modern skills like
								photography and makeup.
							</p>
						</div>{" "}
						{/* Cultural Preservation */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🏛️</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Cultural Preservation
							</h4>
							<p className="text-gray-300">
								Promoting Northeast tribal traditions through
								runway shows featuring traditional attire and
								supporting local artisans through various
								cultural events.
							</p>
						</div>
						{/* Digital Magazine */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">📖</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Digital Magazine
							</h4>
							<p className="text-gray-300">
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
