function About() {
	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-6xl mx-auto px-8">
				{" "}
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-white mb-4">
						About{" "}
						<span className="text-yellow-400 font-bold">
							Saurav Shil
						</span>
					</h1>
					<p className="text-xl text-gray-300">
						Northeast India's Event Management Expert & Arts
						Education Pioneer
					</p>{" "}
					<div className="text-lg text-green-300 mt-2 italic">
						"Your Vision, Our Spectacle"
					</div>
				</div>
				{/* Mission & Vision */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
					<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-3xl font-bold text-yellow-400 mb-6">
							My Mission
						</h2>{" "}
						<p className="text-gray-300 text-lg leading-relaxed">
							To preserve and showcase Northeast India's rich
							tribal heritage through world-class events while
							nurturing the next generation of artists through
							comprehensive education. I believe in creating
							platforms where tradition meets modernity.
						</p>
					</div>

					<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
						<h2 className="text-3xl font-bold text-yellow-400 mb-6">
							My Vision
						</h2>{" "}
						<p className="text-gray-300 text-lg leading-relaxed">
							To establish Northeast India as a premier
							destination for cultural events and arts education.
							I envision a future where our tribal traditions are
							celebrated globally while local artists have
							world-class training facilities.
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
					</h2>{" "}
					<div className="space-y-8">
						{/* Journey Timeline */}
						<div className="space-y-6">
							<div className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold">
									2019
								</div>
								<div>
									<h3 className="text-xl font-bold text-yellow-400 mb-2">
										Started as a Model
									</h3>
									<p className="text-gray-300">
										Beginning my journey in the
										entertainment industry as a professional
										model.
									</p>
								</div>
							</div>
							<div className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
									2020-21
								</div>
								<div>
									<h3 className="text-xl font-bold text-yellow-400 mb-2">
										Online Competitions Era
									</h3>
									<p className="text-gray-300">
										Directed Northeast Talent Hunt (2020)
										and Northeast Shining Star (2020). Prize
										distribution held at Dispur Press Club,
										Guwahati.
									</p>
								</div>
							</div>{" "}
							<div className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
									2022
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-yellow-400 mb-3">
										Expansion Year
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Founded{" "}
										<strong className="text-yellow-400">
											Sankalp Event and Entertainment
										</strong>
										. Organized Perfect Glam Beauty Pageant
										Season 2, launched Goalpara Shining Star
										Season 1, and managed Rongmon cultural
										event.
									</p>
								</div>
								<div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 p-4 rounded-xl border border-yellow-400/40 shadow-xl flex-shrink-0 flex flex-col items-center">
									<img
										src="./logo/sankalp_event_entertainment.jpg"
										alt="Sankalp Event and Entertainment Logo"
										className="h-16 w-16 object-cover rounded-lg shadow-lg"
									/>
									<p className="text-xs text-yellow-400 text-center mt-2 font-semibold">
										Event & Entertainment
									</p>
								</div>
							</div>
							<div className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold">
									2023
								</div>
								<div>
									<h3 className="text-xl font-bold text-yellow-400 mb-2">
										Major Breakthrough
									</h3>
									<p className="text-gray-300">
										Production Head for Guwahati City Fest,
										directed BAIDEHI runway show for CST,
										organized Aadibazar's Aadi The Runway
										Show, and continued Goalpara Shining
										Star Season 2.
									</p>
								</div>
							</div>{" "}
							<div className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
									2024
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-yellow-400 mb-3">
										Peak Performance
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Founded{" "}
										<strong className="text-purple-400">
											Sankalp School of Art and Skills
										</strong>{" "}
										offering 13+ skills training. Director
										of Bongaigaon Winter Carnival, launched
										Bokajan Shining Star, completed Goalpara
										Shining Star Season 3, and managed Style
										Stunner pageant.
									</p>
								</div>
								<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-4 rounded-xl border border-purple-400/40 shadow-xl flex-shrink-0 flex flex-col items-center">
									<img
										src="./logo/sankalp_school.jpg"
										alt="Sankalp School Logo"
										className="h-16 w-16 object-cover rounded-lg shadow-lg"
									/>
									<p className="text-xs text-purple-400 text-center mt-2 font-semibold">
										School of Arts
									</p>
								</div>
							</div>{" "}
							<div className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
								<div className="bg-green-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
									2025
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-green-400 mb-3">
										Current & Future
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Launched{" "}
										<strong className="text-blue-400">
											Aamar Xopun
										</strong>{" "}
										digital magazine celebrating Assamese
										culture. Organized Dudhnoi Shining Star
										Season 1 (Jan 2025) and continuing to
										expand event management and arts
										education initiatives.
									</p>
								</div>
								<div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 p-4 rounded-xl border border-blue-400/40 shadow-xl flex-shrink-0 flex flex-col items-center">
									<img
										src="./logo/aamar_xopun_logo.jpg"
										alt="Aamar Xopun Logo"
										className="h-16 w-16 object-cover rounded-lg shadow-lg"
									/>
									<p className="text-xs text-blue-400 text-center mt-2 font-semibold">
										Digital Magazine
									</p>
								</div>
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
				{/* School Section */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-4">
						<span className="text-yellow-400 font-bold">
							Sankalp School
						</span>{" "}
						of Art and Skills
					</h2>
					<p className="text-center text-xl text-green-300 mb-12 italic">
						"Confidence Starts Here"
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-2xl font-bold text-yellow-400 mb-6">
								Our Locations
							</h3>
							<div className="space-y-4">
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										📍
									</span>
									<span className="text-gray-300">
										Bapujinagar, Carbon Gate
									</span>
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										📍
									</span>
									<span className="text-gray-300">
										LKRB Road, Nabinnagar
									</span>
								</div>
							</div>
						</div>

						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-2xl font-bold text-yellow-400 mb-6">
								13+ Skills We Teach
							</h3>
							<div className="grid grid-cols-2 gap-2 text-gray-300">
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Art
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Dance
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Craft
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Acting
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Singing
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Zumba
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Yoga
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Karate
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Makeup
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Mehendi
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Stitching
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Modelling
								</div>
								<div className="flex items-center">
									<span className="text-yellow-400 mr-2">
										•
									</span>
									Photography
								</div>
							</div>
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
