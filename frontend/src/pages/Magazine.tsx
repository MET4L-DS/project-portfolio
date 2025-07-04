import { useState, useEffect } from "react";
import { magazineAPI } from "../services/api";

function Magazine() {
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [magazineData, setMagazineData] = useState<
		Record<number, Record<string, any>>
	>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchMagazines();
	}, []);

	const fetchMagazines = async () => {
		try {
			setLoading(true);
			const response = await magazineAPI.getMagazinesByYear();
			setMagazineData(response);
			setError(null);
		} catch (err: any) {
			console.error("Error fetching magazines:", err);
			setError("Failed to load magazines");
		} finally {
			setLoading(false);
		}
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

	const handleMonthSelect = async (month: string) => {
		setSelectedMonth(month);
		const magazine = magazineData[selectedYear!]?.[month];
		if (magazine) {
			// Track view
			try {
				await magazineAPI.trackView(magazine._id || magazine.id);
			} catch (err) {
				console.error("Error tracking view:", err);
			}
		}
	};

	const handlePdfDownload = async (magazine: any) => {
		try {
			await magazineAPI.trackDownload(magazine._id || magazine.id);
		} catch (err) {
			console.error("Error tracking download:", err);
		}
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
			{" "}
			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="max-w-6xl mx-auto text-center">
					<div className="mb-8">
						<div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 p-6 rounded-xl border border-blue-400/40 shadow-xl flex flex-col items-center max-w-xs mx-auto mb-6">
							<img
								src="./logo/aamar_xopun_logo.jpg"
								alt="Aamar Xopun Logo"
								className="w-full object-cover rounded-lg shadow-lg mb-3"
							/>
							{/* <p className="text-sm text-blue-400 text-center font-semibold">
								Digital Magazine
							</p> */}
						</div>
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
					{/* Error Message */}
					{error && (
						<div className="mb-8 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded">
							{error}
						</div>
					)}

					{/* Loading State */}
					{loading ? (
						<div className="text-center py-12">
							<div className="text-gray-400 text-lg">
								Loading magazines...
							</div>
						</div>
					) : (
						<>
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
									{availableYears.length === 0 ? (
										<div className="text-center py-12">
											<p className="text-gray-400 text-lg">
												No magazines available yet
											</p>
											<p className="text-gray-500 mt-2">
												Please check back later for new
												releases
											</p>
										</div>
									) : (
										<div className="grid md:grid-cols-3 gap-6">
											{availableYears.map((year) => (
												<button
													key={year}
													onClick={() =>
														handleYearSelect(year)
													}
													className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-8 text-center transition-all hover:scale-105 hover:border-yellow-400"
												>
													<h3 className="text-2xl font-bold text-yellow-400 mb-2">
														{year}
													</h3>{" "}
													<p className="text-gray-300">
														{
															Object.keys(
																magazineData[
																	year
																] || {}
															).length
														}{" "}
														issues available
													</p>
												</button>
											))}
										</div>
									)}
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
											const yearData =
												magazineData[selectedYear];
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
										{(() => {
											const magazine =
												magazineData[selectedYear]?.[
													selectedMonth
												];
											return magazine ? (
												<>
													<div className="mb-6">
														<div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 p-4 rounded-xl border border-blue-400/40 shadow-xl flex flex-col items-center max-w-xs mx-auto mb-4">
															<img
																src={
																	magazine.coverImageUrl ||
																	"./logo/aamar_xopun_logo_2.jpg"
																}
																alt={`${magazine.title} Cover`}
																className="h-20 w-20 object-cover rounded-lg shadow-lg mb-2"
															/>
															<p className="text-xs text-blue-400 text-center font-semibold">
																{selectedMonth}{" "}
																{selectedYear}
															</p>
														</div>
														<h3 className="text-xl font-semibold text-yellow-400 mb-2">
															{magazine.title}
														</h3>
														<p className="text-gray-300 mb-6">
															{
																magazine.description
															}
														</p>
														<div className="flex justify-center gap-4 text-sm text-gray-400 mb-6">
															<span>
																👀{" "}
																{magazine.views ||
																	0}{" "}
																views
															</span>
															<span>
																⬇️{" "}
																{magazine.downloadCount ||
																	0}{" "}
																downloads
															</span>
														</div>
													</div>
													<div className="space-y-4">
														<a
															href={
																magazine.pdfUrl
															}
															target="_blank"
															rel="noopener noreferrer"
															onClick={() =>
																handlePdfDownload(
																	magazine
																)
															}
															className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
														>
															Read Magazine (PDF)
														</a>
														<p className="text-sm text-gray-400">
															Opens in a new tab
														</p>
													</div>
												</>
											) : (
												<div className="py-12">
													<p className="text-gray-400 text-lg">
														Magazine not found
													</p>
												</div>
											);
										})()}
									</div>
								</div>
							)}
						</>
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
