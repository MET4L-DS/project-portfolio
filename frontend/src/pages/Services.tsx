function Services() {
	const services = [
		{
			icon: "🎈",
			title: "Balloon & Theme Decor",
			description:
				"Give your party personality with eye-catching balloon walls, arches, table centrepieces and fully themed décor packages.",
		},
		{
			icon: "💍",
			title: "Weddings & Pre-Wedding Ceremonies",
			items: [
				"Bride & Groom Grand Entry",
				"Haldi & Engagement Set-ups",
				"Stage Décor & Floral Draping",
			],
		},
		{
			icon: "🎂",
			title: "Milestone Celebrations",
			items: [
				"Theme-Based Birthday Parties",
				"Baby Showers & Gender Reveals",
				"Anniversary Soirées",
			],
		},
		{
			icon: "🎉",
			title: "Corporate & Institutional Events",
			items: [
				"Inaugurations & Launching Ceremonies",
				"Brand Promotions & Activations",
				"College Festivals & Government Functions",
			],
		},
	];

	const whyChooseUs = [
		{
			icon: "🎯",
			title: "End-to-End Management",
			description:
				"From concept and design through to flawless execution, we manage every detail so you don't have to.",
		},
		{
			icon: "🎨",
			title: "Tailored Creativity",
			description:
				"We work closely with you to design décor themes, colour palettes, and ambiance that reflect your style.",
		},
		{
			icon: "🤝",
			title: "Professional Partnerships",
			description:
				"Trusted relationships with florists, lighting designers, sound engineers, caterers, and venue partners across the region.",
		},
		{
			icon: "💰",
			title: "Transparent Pricing",
			description:
				"No hidden fees—just clearly outlined packages with flexible add-ons to suit your budget.",
		},
	];

	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-7xl mx-auto px-8">
				{/* Hero Section */}
				<div className="text-center mb-20">
					<div className="mb-8">
						<div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-6 rounded-xl border border-purple-400/40 shadow-xl flex flex-col items-center max-w-xs mx-auto">
							<img
								src="./logo/sankalp_logo.jpg"
								alt="Sankalp Advertisement and Services"
								className="w-full object-cover rounded-lg shadow-lg mb-3"
							/>
						</div>
					</div>
					<h1 className="text-5xl font-bold text-white mb-6">
						<span className="text-yellow-400 font-bold">
							SANKALP
						</span>{" "}
						– Turning Your Dreams into{" "}
						<span className="text-green-300">
							Unforgettable Moments
						</span>
					</h1>
					<p className="text-2xl text-purple-300 mb-8 italic font-semibold">
						"Your Dream, Our Responsibility"
					</p>
				</div>

				{/* About Us */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						About{" "}
						<span className="text-yellow-400 font-bold">Us</span>
					</h2>
					<div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
						<p className="text-gray-300 text-lg leading-relaxed">
							At{" "}
							<span className="text-yellow-400 font-semibold">
								Sankalp Advertisement and Services
							</span>
							, we believe that every celebration tells a story.
							Founded on the promise that your vision is our
							mission, we blend creativity, precision, and passion
							to craft events that leave a lasting impression.
							From intimate baby showers to grand corporate galas,
							our end-to-end event-management expertise ensures
							that you get to enjoy every moment—while we handle
							all the details.
						</p>
					</div>
				</div>

				{/* Our Services */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						Our{" "}
						<span className="text-yellow-400 font-bold">
							Services
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						{services.map((service, index) => (
							<div
								key={index}
								className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
							>
								<div className="text-5xl mb-4">
									{service.icon}
								</div>
								<h3 className="text-2xl font-bold text-yellow-400 mb-4">
									{service.title}
								</h3>
								{service.description && (
									<p className="text-gray-300 text-lg">
										{service.description}
									</p>
								)}
								{service.items && (
									<ul className="text-gray-300 text-lg space-y-2">
										{service.items.map(
											(item, itemIndex) => (
												<li
													key={itemIndex}
													className="flex items-center"
												>
													<span className="text-green-400 mr-2">
														•
													</span>
													{item}
												</li>
											)
										)}
									</ul>
								)}
							</div>
						))}
					</div>
					<div className="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">
						<p className="text-green-300 text-lg">
							Each service comes with{" "}
							<span className="text-white font-semibold">
								custom-designed décor
							</span>
							,{" "}
							<span className="text-white font-semibold">
								on-site setup and teardown
							</span>
							, and a{" "}
							<span className="text-white font-semibold">
								dedicated event manager
							</span>{" "}
							to make sure your vision comes to life perfectly.
						</p>
					</div>
				</div>

				{/* Why Choose Sankalp */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						Why Choose{" "}
						<span className="text-yellow-400 font-bold">
							Sankalp
						</span>
						?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{whyChooseUs.map((reason, index) => (
							<div
								key={index}
								className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
							>
								<div className="text-5xl mb-4">
									{reason.icon}
								</div>
								<h3 className="text-2xl font-bold text-yellow-400 mb-4">
									{reason.title}
								</h3>
								<p className="text-gray-300 text-lg">
									{reason.description}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center">
					<h3 className="text-3xl font-bold text-white mb-4">
						Ready to Make Your Event Unforgettable?
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Let's bring your vision to life with our expert event
						management services
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/contact"
							className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
						>
							Contact Us Today
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Services;
