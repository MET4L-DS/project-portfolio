import { useState } from "react";

function Events() {
	const [activeCategory, setActiveCategory] = useState("All");
	const events = [
		{
			id: 1,
			title: "NABARD Karigar Mela - Traditional Runway",
			category: "Cultural Festival",
			year: "2022-2023",
			location: "Guwahati",
			image: "./images/Nabard.jpg",
			description:
				"Organized Traditional Attire runway show showcasing all north-eastern tribes for National Bank of Agriculture and Rural Development.",
			importance: "high",
		},
		{
			id: 2,
			title: "Aadibazaar - Aadi The Runway Show",
			category: "Cultural Festival",
			year: "Dec 15, 2023",
			location: "Guwahati",
			image: "./images/Aadibazaar.jpg",
			description:
				"Tribal beats, Local Threads: Where Tradition Meets The Catwalk - Under TRIFED showcasing north-eastern traditional attire.",
			importance: "high",
		},
		{
			id: 3,
			title: "Bongaigaon Winter Carnival - Couturiers' Euphoria",
			category: "Fashion Show",
			year: "Jan 7, 2024",
			location: "Bongaigaon",
			image: "./images/Bongaigaoo Winter Carnival.jpg",
			description:
				"Director and Organizer of this spectacular runway show at Bongaigaon Winter Carnival.",
			importance: "high",
		},
		{
			id: 4,
			title: "CST Vocational Training - BAIDEHI Runway",
			category: "Fashion Show",
			year: "July 30, 2023",
			location: "Guwahati",
			image: "./images/Baidehi.jpg",
			description:
				"Director of BAIDEHI runway show for CST vocational training trust.",
			importance: "high",
		},
		{
			id: 5,
			title: "Goalpara Shining Star (3 Seasons)",
			category: "Beauty Pageant",
			year: "2022-2024",
			location: "Goalpara",
			image: "./images/Goalpara_s2.jpg",
			description:
				"Director of Season 1 (2022), Season 2 (2023), Season 3 (Sep 8, 2024) - Premier beauty pageant series.",
			importance: "high",
		},
		{
			id: 6,
			title: "Bokajan Shining Star",
			category: "Beauty Pageant",
			year: "May 16, 2024",
			location: "Bokajan",
			image: "./images/Bokajan Shining Star.jpg",
			description:
				"Director of Season 1 - Bringing glamour and talent showcase to Bokajan.",
			importance: "high",
		},
		{
			id: 7,
			title: "Dudhnoi Shining Star",
			category: "Beauty Pageant",
			year: "Jan 12, 2025",
			location: "Dudhnoi",
			image: "https://via.placeholder.com/400x300/06b6d4/ffffff?text=Dudhnoi+Star",
			description:
				"Director of Season 1 - Latest addition to the Shining Star pageant series.",
			importance: "high",
		},
		{
			id: 8,
			title: "Guwahati City Fest",
			category: "City Festival",
			year: "2023",
			location: "Guwahati",
			image: "./images/Guwahati City Fest.jpg",
			description:
				"Production Head of this major city-wide celebration and entertainment festival.",
			importance: "high",
		},
		{
			id: 9,
			title: "Style Stunner by Ekadfa",
			category: "Beauty Pageant",
			year: "Oct 27, 2024",
			location: "Bokajan",
			image: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Style+Stunner",
			description:
				"Management Head of this beauty pageant organized by Ekadfa.",
			importance: "low",
		},
		{
			id: 10,
			title: "Rongmon Cultural Event",
			category: "Cultural Event",
			year: "2022",
			location: "Baihata, Kamrup Rural",
			image: "https://via.placeholder.com/400x300/14b8a6/ffffff?text=Rongmon",
			description:
				"Management Head and Organizer of this cultural celebration.",
			importance: "low",
		},
		{
			id: 11,
			title: "Northeast Talent Hunt & Shining Star",
			category: "Talent Hunt",
			year: "2020",
			location: "Guwahati",
			image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=NE+Talent",
			description:
				"Director of both Northeast Talent Hunt and Northeast Shining Star. Prize distribution held at Dispur Press Club.",
			importance: "low",
		},
		{
			id: 12,
			title: "Fashion Carnival & Frolic",
			category: "Fashion Show",
			year: "Various",
			location: "Multiple",
			image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Fashion+Shows",
			description:
				"Event Management Head for Fashion Carnival and Fashion Frolic runway shows.",
			importance: "low",
		},
		{
			id: 13,
			title: "IIT Alcheringa Runway Show",
			category: "Cultural Festival",
			year: "Various",
			location: "IIT Guwahati",
			image: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Alcheringa",
			description:
				"Management head of runway show for IIT Guwahati's premier cultural festival.",
			importance: "low",
		},
	];
	const categories = [
		"All",
		"Beauty Pageant",
		"Cultural Festival",
		"Fashion Show",
		"City Festival",
		"Cultural Event",
		"Talent Hunt",
	];

	// Filter events by category and prioritize important ones
	const filteredEvents =
		activeCategory === "All"
			? events
			: events.filter((event) => event.category === activeCategory);

	// Sort by importance (high first) and then by year (recent first)
	const sortedEvents = [...filteredEvents].sort((a, b) => {
		if (a.importance !== b.importance) {
			return a.importance === "high" ? -1 : 1;
		}
		return b.year.localeCompare(a.year);
	});

	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-7xl mx-auto px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-white mb-4">
						My{" "}
						<span className="text-yellow-400 font-bold">
							Event Portfolio
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						From beauty pageants to cultural festivals, witness the
						spectacular events that have shaped Northeast India's
						entertainment landscape
					</p>
				</div>
				{/* Category Filter */}
				<div className="flex justify-center mb-12">
					<div className="flex flex-wrap gap-2 justify-center">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`px-4 py-2 rounded-full border-2 border-yellow-400 font-semibold transition-all text-sm ${
									activeCategory === category
										? "bg-yellow-400 text-black"
										: "text-yellow-400 hover:bg-yellow-400 hover:text-black"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>{" "}
				{/* Photo Gallery */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					{sortedEvents.map((event) => (
						<div
							key={event.id}
							className="group relative overflow-hidden rounded-2xl aspect-video transition-transform duration-300 hover:scale-105"
						>
							<img
								src={event.image}
								alt={event.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />{" "}
							<div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
								<div className="flex justify-between items-start mb-2">
									<span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
										{event.category}
									</span>
									{event.importance === "high" && (
										<span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
											Featured
										</span>
									)}
								</div>
								<h3 className="text-xl font-bold mb-1">
									{event.title}
								</h3>
								<div className="text-sm text-gray-400 mb-2">
									{event.year} • {event.location}
								</div>
								<p className="text-gray-300 text-sm">
									{event.description}
								</p>
							</div>
						</div>
					))}
				</div>
				{/* Call to Action */}
				<div className="text-center mt-16">
					<h3 className="text-3xl font-bold text-white mb-4">
						Ready to create your next big event?
					</h3>
					<p className="text-gray-300 mb-8 text-lg">
						Let's collaborate to bring your vision to life with
						Sankalp Entertainment
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
							Book Consultation
						</button>
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

export default Events;
