import { useState, useEffect } from "react";
import StudentRegistration from "../components/StudentRegistration";
import RegistrationSuccess from "../components/RegistrationSuccess";
import { locationsAPI, skillsAPI, galleryAPI } from "../services/api";

interface Location {
	_id: string;
	name: string;
	address: string;
	icon: string;
	displayOrder: number;
	isActive: boolean;
}

interface Skill {
	_id: string;
	name: string;
	icon: string;
	description?: string;
	displayOrder: number;
	isActive: boolean;
}

interface GalleryImage {
	_id: string;
	title: string;
	description?: string;
	image: {
		url: string;
		publicId: string;
	};
	category: string;
	displayOrder: number;
	isActive: boolean;
}

function School() {
	const [showRegistrationForm, setShowRegistrationForm] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [registrationFormNo, setRegistrationFormNo] = useState<string>("");
	const [locations, setLocations] = useState<Location[]>([]);
	const [skills, setSkills] = useState<Skill[]>([]);
	const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<
		string | null
	>(null);
	const [loading, setLoading] = useState(true);

	// Fetch locations and skills data
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [locationsData, skillsData, galleryData] =
					await Promise.all([
						locationsAPI.getAllLocations(),
						skillsAPI.getAllSkills(),
						galleryAPI.getAllGalleryImages("School"),
					]);
				setLocations(locationsData);
				setSkills(skillsData);
				setGalleryImages(galleryData || []);
			} catch (error) {
				console.error("Error fetching school data:", error);
				// Fallback to default data if API fails
				setLocations([
					{
						_id: "1",
						name: "Carbon Gate",
						address: "Bapujinagar, Carbon Gate\nGuwahati, Assam",
						icon: "📍",
						displayOrder: 1,
						isActive: true,
					},
					{
						_id: "2",
						name: "Nabinnagar",
						address: "LKRB Road, Nabinnagar\nGuwahati, Assam",
						icon: "📍",
						displayOrder: 2,
						isActive: true,
					},
				]);
				setSkills([
					{
						_id: "1",
						name: "Art",
						icon: "🎨",
						displayOrder: 1,
						isActive: true,
					},
					{
						_id: "2",
						name: "Dance",
						icon: "💃",
						displayOrder: 2,
						isActive: true,
					},
					{
						_id: "3",
						name: "Craft",
						icon: "🧵",
						displayOrder: 3,
						isActive: true,
					},
					{
						_id: "4",
						name: "Acting",
						icon: "🎭",
						displayOrder: 4,
						isActive: true,
					},
					{
						_id: "5",
						name: "Singing",
						icon: "🎤",
						displayOrder: 5,
						isActive: true,
					},
					{
						_id: "6",
						name: "Zumba",
						icon: "🕺",
						displayOrder: 6,
						isActive: true,
					},
					{
						_id: "7",
						name: "Yoga",
						icon: "🧘",
						displayOrder: 7,
						isActive: true,
					},
					{
						_id: "8",
						name: "Karate",
						icon: "🥋",
						displayOrder: 8,
						isActive: true,
					},
					{
						_id: "9",
						name: "Makeup",
						icon: "💄",
						displayOrder: 9,
						isActive: true,
					},
					{
						_id: "10",
						name: "Mehendi",
						icon: "✋",
						displayOrder: 10,
						isActive: true,
					},
					{
						_id: "11",
						name: "Stitching",
						icon: "👗",
						displayOrder: 11,
						isActive: true,
					},
					{
						_id: "12",
						name: "Modelling",
						icon: "📸",
						displayOrder: 12,
						isActive: true,
					},
					{
						_id: "13",
						name: "Photography",
						icon: "📷",
						displayOrder: 13,
						isActive: true,
					},
				]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleEnrollClick = () => {
		setShowRegistrationForm(true);
	};

	const handleRegistrationSuccess = (formNo: string) => {
		setRegistrationFormNo(formNo);
		setShowRegistrationForm(false);
		setShowSuccessModal(true);
	};

	const handleCloseRegistration = () => {
		setShowRegistrationForm(false);
	};

	const handleCloseSuccess = () => {
		setShowSuccessModal(false);
		setRegistrationFormNo("");
	};
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
						{loading ? (
							<div className="col-span-2 flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
							</div>
						) : (
							locations.map((location) => (
								<div
									key={location._id}
									className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
								>
									<div className="text-4xl mb-4">
										{location.icon}
									</div>
									<h3 className="text-2xl font-bold text-yellow-400 mb-4">
										{location.name}
									</h3>
									<p className="text-gray-300 text-lg whitespace-pre-line">
										{location.address}
									</p>
								</div>
							))
						)}
					</div>
				</div>
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center text-white mb-12">
						<span className="text-yellow-400 font-bold">
							{skills.length}+ Skills
						</span>{" "}
						We Teach
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{loading ? (
							<div className="col-span-full flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
							</div>
						) : (
							skills.map((skill) => (
								<div
									key={skill._id}
									className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-center hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
								>
									<div className="text-4xl mb-3">
										{skill.icon}
									</div>
									<h3 className="text-lg font-bold text-yellow-400">
										{skill.name}
									</h3>
									{skill.description && (
										<p className="text-sm text-gray-400 mt-2">
											{skill.description}
										</p>
									)}
								</div>
							))
						)}
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
				{/* Gallery Section */}
				{galleryImages.length > 0 && (
					<div className="mb-20">
						<h2 className="text-4xl font-bold text-center text-white mb-12">
							Our{" "}
							<span className="text-yellow-400 font-bold">
								Gallery
							</span>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{galleryImages.map((image) => (
								<div
									key={image._id}
									className="group relative overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
									onClick={() =>
										setSelectedGalleryImage(image.image.url)
									}
								>
									<img
										src={image.image.url}
										alt={image.title}
										className="w-full h-64 object-cover rounded-2xl"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
										<div className="text-center text-white p-4">
											<h3 className="text-xl font-bold mb-2">
												{image.title}
											</h3>
											{image.description && (
												<p className="text-gray-200 text-sm">
													{image.description}
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
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
						<button
							onClick={handleEnrollClick}
							className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
						>
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
				{/* Registration Form Modal */}
				{showRegistrationForm && (
					<StudentRegistration
						onClose={handleCloseRegistration}
						onSuccess={handleRegistrationSuccess}
					/>
				)}
				{/* Success Modal */}
				{showSuccessModal && (
					<RegistrationSuccess
						formNo={registrationFormNo}
						onClose={handleCloseSuccess}
					/>
				)}
				{/* Gallery Image Modal */}
				{selectedGalleryImage && (
					<div
						className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedGalleryImage(null)}
					>
						<div className="relative max-w-7xl max-h-[90vh]">
							<img
								src={selectedGalleryImage}
								alt="Gallery Image"
								className="max-w-full max-h-full object-contain rounded-lg"
								onClick={(e) => e.stopPropagation()}
							/>
							<button
								onClick={() => setSelectedGalleryImage(null)}
								className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-black/70 transition-colors"
							>
								×
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default School;
