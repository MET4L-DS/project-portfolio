function School() {
	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-7xl mx-auto px-8">
				{" "}
				{/* Header */}
				<div className="text-center mb-16">
					<div className="mb-8">
						<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-6 rounded-xl border border-purple-400/40 shadow-xl flex flex-col items-center max-w-xs mx-auto">
							<img
								src="./logo/sankalp_school_2.jpg"
								alt="Sankalp School of Art and Skills"
								className="w-full object-cover rounded-lg shadow-lg mb-3"
							/>
							{/* <p className="text-sm text-purple-400 text-center font-semibold">
								School of Art & Skills
							</p> */}
						</div>
					</div>
					<h1 className="text-5xl font-bold text-white mb-4">
						<span className="text-yellow-400 font-bold">
							Sankalp School
						</span>{" "}
						of Art and Skills
					</h1>
					<p className="text-2xl text-green-300 mb-6 italic">
						"Confidence Starts Here"
					</p>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Nurturing creativity and building confidence through
						comprehensive arts education. Where traditional skills
						meet modern techniques.
					</p>
				</div>
				{/* Our Locations */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						Our{" "}
						<span className="text-yellow-400 font-bold">
							Locations
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl mb-4">📍</div>
							<h3 className="text-2xl font-bold text-yellow-400 mb-4">
								Carbon Gate
							</h3>
							<p className="text-gray-300 text-lg">
								Bapujinagar, Carbon Gate
								<br />
								Guwahati, Assam
							</p>
						</div>
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-4xl mb-4">📍</div>
							<h3 className="text-2xl font-bold text-yellow-400 mb-4">
								Nabinnagar
							</h3>
							<p className="text-gray-300 text-lg">
								LKRB Road, Nabinnagar
								<br />
								Guwahati, Assam
							</p>
						</div>
					</div>
				</div>
				{/* Skills We Teach */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						<span className="text-yellow-400 font-bold">
							13+ Skills
						</span>{" "}
						We Teach
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{[
							{ name: "Art", icon: "🎨" },
							{ name: "Dance", icon: "💃" },
							{ name: "Craft", icon: "🧵" },
							{ name: "Acting", icon: "🎭" },
							{ name: "Singing", icon: "🎤" },
							{ name: "Zumba", icon: "🕺" },
							{ name: "Yoga", icon: "🧘" },
							{ name: "Karate", icon: "🥋" },
							{ name: "Makeup", icon: "💄" },
							{ name: "Mehendi", icon: "✋" },
							{ name: "Stitching", icon: "👗" },
							{ name: "Modelling", icon: "📸" },
							{ name: "Photography", icon: "📷" },
						].map((skill, index) => (
							<div
								key={index}
								className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
							>
								<div className="text-4xl mb-3">
									{skill.icon}
								</div>
								<h3 className="text-lg font-bold text-yellow-400">
									{skill.name}
								</h3>
							</div>
						))}
					</div>
				</div>
				{/* Why Choose Us */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						Why Choose{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp School
						</span>
						?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">👨‍🏫</div>
							<h3 className="text-2xl font-bold text-yellow-400 mb-4">
								Expert Instructors
							</h3>
							<p className="text-gray-300">
								Learn from industry professionals and
								experienced artists who are passionate about
								teaching.
							</p>
						</div>

						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🏆</div>
							<h3 className="text-2xl font-bold text-yellow-400 mb-4">
								Proven Track Record
							</h3>
							<p className="text-gray-300">
								Our students have gone on to win competitions
								and establish successful careers in their chosen
								fields.
							</p>
						</div>

						<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
							<div className="text-6xl mb-4">🎯</div>
							<h3 className="text-2xl font-bold text-yellow-400 mb-4">
								Personalized Training
							</h3>
							<p className="text-gray-300">
								Small batch sizes ensure individual attention
								and customized learning paths for each student.
							</p>
						</div>
					</div>
				</div>
				{/* Call to Action */}
				<div className="text-center">
					<h3 className="text-3xl font-bold text-white mb-4">
						Ready to Start Your Creative Journey?
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Join Sankalp School of Art and Skills and unlock your
						potential
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
							Enroll Now
						</button>
						<a
							href="/contact"
							className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
						>
							Contact for Details
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default School;
