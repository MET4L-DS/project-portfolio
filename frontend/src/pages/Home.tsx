import { Link } from "react-router-dom";

function Home() {
	return (
		<>
			{/* Hero Section */}
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-indigo-700 via-purple-800 via-orange-800 to-red-600">
				<div className="text-center px-8 max-w-6xl mx-auto">
					{/* Profile Picture */}
					<div className="mb-8">
						<img
							src="/profile-picture.jpg"
							alt="Saurav Shil - Event Management Expert"
							className="w-56 h-56 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl object-cover"
						/>
					</div>

					{/* Name & Title */}
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
						<span className="text-yellow-400">SAURAV SHIL</span>
						<br />
						Event Management & Media Pioneer
					</h1>

					{/* Organization */}
					<h2 className="text-2xl md:text-3xl text-yellow-300 mb-6 font-light">
						Founder of{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp Entertainment
						</span>{" "}
						&{" "}
						<span className="text-yellow-400 font-bold">
							AAMAR XOPUN
						</span>{" "}
						E-Magazine
					</h2>

					{/* Mission Statement */}
					<p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
						Transforming Assam's entertainment landscape through
						world-class events, beauty pageants, and digital media.
						Creating platforms that showcase Northeast India's
						incredible talent and cultural richness to the world.
					</p>

					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Link
							to="/projects"
							className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
						>
							View Our Events
						</Link>
						<Link
							to="/about"
							className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105"
						>
							My Journey
						</Link>
						<a
							href="https://aamarxopun.com"
							target="_blank"
							rel="noopener noreferrer"
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							AAMAR XOPUN Magazine
						</a>
					</div>

					{/* Impact Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								50+
							</div>
							<p className="text-gray-300 text-lg">
								Major Events Organized
							</p>
						</div>
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								10K+
							</div>
							<p className="text-gray-300 text-lg">
								Talents Showcased
							</p>
						</div>
						<div className="text-center">
							<div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
								15+
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
				<div className="max-w-7xl mx-auto px-8">
					<h3 className="text-4xl font-bold text-center text-white mb-12">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Expertise Areas
						</span>
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Event Management */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🎭</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Event Management
							</h4>
							<p className="text-gray-300">
								Expert in organizing large-scale events, beauty
								pageants, fashion shows, and cultural festivals
								across Northeast India.
							</p>
						</div>

						{/* Media & Publishing */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">📱</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Digital Media
							</h4>
							<p className="text-gray-300">
								Founder & Editor of AAMAR XOPUN E-Magazine,
								showcasing Northeast culture, talent, and
								stories to a global audience.
							</p>
						</div>

						{/* Talent Management */}
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">⭐</div>
							<h4 className="text-2xl font-bold text-yellow-400 mb-4">
								Talent Development
							</h4>
							<p className="text-gray-300">
								Creating platforms for emerging artists, models,
								and performers through talent hunts and beauty
								pageants.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
