function About() {
	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-6xl mx-auto px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-white mb-4">
						About{" "}
						<span className="text-yellow-400 font-bold">
							Saurav Shil
						</span>
					</h1>
					<p className="text-xl text-gray-300">
						Northeast India's Premier Event Management Expert &
						Media Entrepreneur
					</p>
				</div>

				{/* Mission & Vision */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
					<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-3xl font-bold text-yellow-400 mb-6">
							My Mission
						</h2>
						<p className="text-gray-300 text-lg leading-relaxed">
							To elevate Northeast India's entertainment industry
							by creating world-class events that showcase our
							region's incredible talent, culture, and beauty.
							Through Sankalp Entertainment and AAMAR XOPUN, I aim
							to build bridges between local talent and global
							opportunities.
						</p>
					</div>

					<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-3xl font-bold text-yellow-400 mb-6">
							My Vision
						</h2>
						<p className="text-gray-300 text-lg leading-relaxed">
							To establish Northeast India as a premier
							destination for entertainment, fashion, and cultural
							events. I envision a future where our region's
							artists and performers have equal opportunities to
							shine on national and international stages.
						</p>
					</div>
				</div>

				{/* Experience Timeline */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Journey
						</span>
					</h2>

					<div className="space-y-8">
						{/* Sankalp Entertainment */}
						<div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<div className="md:w-1/3">
								<img
									src="https://via.placeholder.com/300x200/f59e0b/ffffff?text=Sankalp+Logo"
									alt="Sankalp Entertainment"
									className="rounded-lg shadow-xl w-full"
								/>
							</div>
							<div className="md:w-2/3">
								<h3 className="text-2xl font-bold text-yellow-400 mb-4">
									Founder - Sankalp Entertainment
								</h3>
								<p className="text-gray-300 leading-relaxed">
									Established Northeast India's leading event
									management company, specializing in beauty
									pageants, talent hunts, fashion shows, and
									cultural festivals. Under my leadership,
									Sankalp has become synonymous with quality
									entertainment and professional event
									management.
								</p>
							</div>
						</div>

						{/* AAMAR XOPUN */}
						<div className="flex flex-col md:flex-row-reverse items-center gap-8 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<div className="md:w-1/3">
								<img
									src="https://via.placeholder.com/300x200/10b981/ffffff?text=AAMAR+XOPUN"
									alt="AAMAR XOPUN E-Magazine"
									className="rounded-lg shadow-xl w-full"
								/>
							</div>
							<div className="md:w-2/3">
								<h3 className="text-2xl font-bold text-yellow-400 mb-4">
									Founder & Editor - AAMAR XOPUN E-Magazine
								</h3>
								<p className="text-gray-300 leading-relaxed">
									Created and launched Northeast India's
									premier digital magazine, showcasing local
									culture, talent, fashion, and stories. AAMAR
									XOPUN has become a vital platform for
									promoting Northeast heritage and connecting
									our community with the world.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Major Achievements */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						Major{" "}
						<span className="text-yellow-400 font-bold">
							Achievements
						</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🏆 Event Organizer
							</h3>
							<ul className="text-gray-300 space-y-2">
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Northeast Talent Hunt
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Northeast Shining Star
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Perfect Glam Beauty Pageant Season 2
								</li>
							</ul>
						</div>

						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🎬 Production Leadership
							</h3>
							<ul className="text-gray-300 space-y-2">
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Production Head - Guwahati City Fest
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Show Director - Goalpara Shining Star
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Event Manager - Fashion Carnival & Frolic
								</li>
							</ul>
						</div>

						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🌟 Special Projects
							</h3>
							<ul className="text-gray-300 space-y-2">
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Sustainable Runway at Kite Festival
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Alcheringa Cultural Events
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Shrimoyee Cultural Celebration
								</li>
							</ul>
						</div>

						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								📱 Media Ventures
							</h3>
							<ul className="text-gray-300 space-y-2">
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									AAMAR XOPUN E-Magazine Founder
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Digital Content Creation
								</li>
								<li className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Northeast Culture Promotion
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center">
					<h3 className="text-3xl font-bold text-white mb-4">
						Let's Create Something Amazing Together
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Ready to bring your event vision to life? Let's discuss
						your next big project.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/contact"
							className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
						>
							Get In Touch
						</a>
						<a
							href="https://aamarxopun.com"
							target="_blank"
							rel="noopener noreferrer"
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							Visit AAMAR XOPUN
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;
