import { useState } from "react";

function Magazine() {
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	// Magazine data structure - you can expand this with actual data
	const magazineData: Record<number, Record<string, string>> = {
		2025: {
			January: "./pdf/demo.pdf",
			// Add more months as they become available
		},
		2024: {
			// Add previous year data as needed
		},
		2023: {
			// Add previous year data as needed
		},
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const availableYears = Object.keys(magazineData)
		.map(Number)
		.sort((a, b) => b - a);

	const handleYearSelect = (year: number) => {
		setSelectedYear(year);
		setSelectedMonth(null);
	};

	const handleMonthSelect = (month: string) => {
		setSelectedMonth(month);
	};

	const handleBackToYears = () => {
		setSelectedYear(null);
		setSelectedMonth(null);
	};

	const handleBackToMonths = () => {
		setSelectedMonth(null);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<div className="mb-8">
						<img
							src="./logo/aamar_xopun_logo.jpg"
							alt="Aamar Xopun Logo"
							className="h-24 mx-auto mb-6 rounded-lg shadow-lg"
						/>
						<h1 className="text-5xl font-bold mb-4">
							<span className="text-yellow-400">Aamar Xopun</span>
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Discover our digital magazine celebrating Assamese
							culture, literature, and contemporary life. Browse
							through our collection of monthly editions featuring
							stories, articles, and insights from our vibrant
							community.
						</p>
					</div>
				</div>
			</section>

			{/* Magazine Navigation */}
			<section className="py-16 px-4">
				<div className="max-w-4xl mx-auto">
					{/* Breadcrumb */}
					<div className="mb-8">
						<nav className="flex items-center space-x-2 text-sm text-gray-400">
							<button
								onClick={handleBackToYears}
								className="hover:text-yellow-400 transition-colors"
							>
								Magazine Archive
							</button>
							{selectedYear && (
								<>
									<span>›</span>
									<button
										onClick={handleBackToMonths}
										className="hover:text-yellow-400 transition-colors"
									>
										{selectedYear}
									</button>
								</>
							)}
							{selectedMonth && (
								<>
									<span>›</span>
									<span className="text-white">
										{selectedMonth}
									</span>
								</>
							)}
						</nav>
					</div>

					{/* Year Selection */}
					{!selectedYear && (
						<div>
							<h2 className="text-3xl font-bold mb-8 text-center">
								Select Year
							</h2>
							<div className="grid md:grid-cols-3 gap-6">
								{availableYears.map((year) => (
									<button
										key={year}
										onClick={() => handleYearSelect(year)}
										className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-8 text-center transition-all hover:scale-105 hover:border-yellow-400"
									>
										<h3 className="text-2xl font-bold text-yellow-400 mb-2">
											{year}
										</h3>{" "}
										<p className="text-gray-300">
											{
												Object.keys(magazineData[year])
													.length
											}{" "}
											issues available
										</p>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Month Selection */}
					{selectedYear && !selectedMonth && (
						<div>
							<h2 className="text-3xl font-bold mb-8 text-center">
								{selectedYear} Issues
							</h2>
							<div className="grid md:grid-cols-4 gap-4">
								{" "}
								{months.map((month) => {
									const yearData = magazineData[selectedYear];
									const isAvailable =
										yearData && yearData[month];
									return (
										<button
											key={month}
											onClick={() =>
												isAvailable &&
												handleMonthSelect(month)
											}
											disabled={!isAvailable}
											className={`p-6 rounded-lg text-center transition-all ${
												isAvailable
													? "bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:scale-105 hover:border-yellow-400 cursor-pointer"
													: "bg-gray-900 border border-gray-700 text-gray-500 cursor-not-allowed"
											}`}
										>
											<h3
												className={`text-lg font-semibold ${
													isAvailable
														? "text-yellow-400"
														: "text-gray-500"
												}`}
											>
												{month}
											</h3>
											{isAvailable ? (
												<p className="text-sm text-gray-300 mt-2">
													Available
												</p>
											) : (
												<p className="text-sm text-gray-500 mt-2">
													Coming Soon
												</p>
											)}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Magazine Viewer */}
					{selectedYear && selectedMonth && (
						<div>
							<h2 className="text-3xl font-bold mb-8 text-center">
								{selectedMonth} {selectedYear} Issue
							</h2>
							<div className="bg-gray-800 rounded-lg p-8 text-center">
								<div className="mb-6">
									<img
										src="./logo/aamar_xopun_logo_2.jpg"
										alt="Aamar Xopun Issue Cover"
										className="h-32 mx-auto mb-4 rounded-lg shadow-lg"
									/>
									<h3 className="text-xl font-semibold text-yellow-400 mb-2">
										{selectedMonth} {selectedYear} Edition
									</h3>
									<p className="text-gray-300 mb-6">
										Explore the latest stories, articles,
										and cultural insights in this month's
										edition.
									</p>
								</div>
								<div className="space-y-4">
									<a
										href={
											magazineData[selectedYear]?.[
												selectedMonth
											]
										}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
									>
										Read Magazine (PDF)
									</a>
									<p className="text-sm text-gray-400">
										Opens in a new tab
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* About Section */}
			<section className="py-16 px-4 bg-gray-800/50">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl font-bold mb-6">
						About Aamar Xopun
					</h2>
					<p className="text-lg text-gray-300 leading-relaxed">
						"Aamar Xopun" (Our Dreams) is a digital magazine
						dedicated to preserving and celebrating Assamese culture
						while embracing contemporary perspectives. Each issue
						features literary works, cultural articles, community
						stories, and insights that connect our rich heritage
						with modern life. Join us on this journey of
						storytelling and cultural exploration.
					</p>
				</div>
			</section>
		</div>
	);
}

export default Magazine;
