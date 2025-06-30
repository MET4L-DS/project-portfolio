import React, { useState } from "react";
import { studentAPI } from "../services/api";

interface StudentRegistrationProps {
	onClose: () => void;
	onSuccess: (formNo: string) => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({
	onClose,
	onSuccess,
}) => {
	const [formData, setFormData] = useState({
		studentName: "",
		addressLine1: "",
		addressLine2: "",
		addressLine3: "",
		phoneNumber: "",
		gender: "",
		age: "",
		dateOfBirth: "",
		parentsName: "",
		parentsNumber: "",
		registrationDate: new Date().toISOString().split("T")[0],
	});

	const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const courses = [
		"Art",
		"Craft",
		"Acting",
		"Singing",
		"Yoga",
		"Dance",
		"Karate",
		"Stitching",
		"Mehendi",
		"Modelling",
		"Makeup",
		"Photography",
		"Beautician",
	];

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCourseChange = (course: string) => {
		setSelectedCourses((prev) =>
			prev.includes(course)
				? prev.filter((c) => c !== course)
				: [...prev, course]
		);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				setError("Please select an image file");
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				setError("Image file size must be less than 5MB");
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setPhotoFile(file);
				setPhotoPreview(result);
			};
			reader.readAsDataURL(file);
			setError(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validation
			if (selectedCourses.length === 0) {
				throw new Error("Please select at least one course");
			}

			if (
				!formData.studentName ||
				!formData.addressLine1 ||
				!formData.phoneNumber ||
				!formData.gender ||
				!formData.age ||
				!formData.dateOfBirth ||
				!formData.parentsName ||
				!formData.parentsNumber
			) {
				throw new Error("Please fill in all required fields");
			}

			const submitFormData = new FormData();

			// Add form data
			Object.entries(formData).forEach(([key, value]) => {
				submitFormData.append(key, value);
			});

			// Add courses
			selectedCourses.forEach((course) => {
				submitFormData.append("courses", course);
			});

			// Add files
			if (photoFile) {
				submitFormData.append("photo", photoFile);
			}

			const response = await studentAPI.registerStudent(submitFormData);
			onSuccess(response.formNo);
		} catch (err: any) {
			console.error("Error submitting registration:", err);
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to submit registration"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-white">
						Student Registration Form
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white text-2xl"
					>
						×
					</button>
				</div>

				{error && (
					<div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid md:grid-cols-2 gap-6">
						{/* Left Column */}
						<div className="space-y-4">
							{/* Student Name */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Student Name *
								</label>
								<input
									type="text"
									name="studentName"
									value={formData.studentName}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>

							{/* Address */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Address *
								</label>
								<input
									type="text"
									name="addressLine1"
									value={formData.addressLine1}
									onChange={handleInputChange}
									placeholder="Address Line 1"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
									required
								/>
								<input
									type="text"
									name="addressLine2"
									value={formData.addressLine2}
									onChange={handleInputChange}
									placeholder="Address Line 2"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
								/>
								<input
									type="text"
									name="addressLine3"
									value={formData.addressLine3}
									onChange={handleInputChange}
									placeholder="Address Line 3"
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
								/>
							</div>

							{/* Phone Number */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Phone Number *
								</label>
								<input
									type="tel"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>

							{/* Gender and Age */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Gender *
									</label>
									<select
										name="gender"
										value={formData.gender}
										onChange={handleInputChange}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
										required
									>
										<option value="">Select Gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Age *
									</label>
									<input
										type="number"
										name="age"
										value={formData.age}
										onChange={handleInputChange}
										min="3"
										max="100"
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
										required
									/>
								</div>
							</div>

							{/* Date of Birth */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Date of Birth *
								</label>
								<input
									type="date"
									name="dateOfBirth"
									value={formData.dateOfBirth}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>

							{/* Parents' Name */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Parents' Name *
								</label>
								<input
									type="text"
									name="parentsName"
									value={formData.parentsName}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>

							{/* Parents' Number */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Parents' Number *
								</label>
								<input
									type="tel"
									name="parentsNumber"
									value={formData.parentsNumber}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>
						</div>

						{/* Right Column */}
						<div className="space-y-4">
							{/* Photo Upload */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Passport Size Photo
								</label>
								<div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
										id="photo-upload"
									/>
									<label
										htmlFor="photo-upload"
										className="cursor-pointer block"
									>
										{photoPreview ? (
											<img
												src={photoPreview}
												alt="Student Photo"
												className="w-32 h-40 object-cover rounded mx-auto"
											/>
										) : (
											<div className="text-center">
												<div className="text-gray-400 mb-2">
													📸
												</div>
												<span className="text-gray-300">
													Click to upload photo
												</span>
											</div>
										)}
									</label>
								</div>
							</div>

							{/* Course Selection */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Course Options * (Select at least one)
								</label>
								<div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
									{courses.map((course) => (
										<label
											key={course}
											className="flex items-center text-gray-300"
										>
											<input
												type="checkbox"
												checked={selectedCourses.includes(
													course
												)}
												onChange={() =>
													handleCourseChange(course)
												}
												className="mr-2 h-4 w-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
											/>
											{course}
										</label>
									))}
								</div>
								<div className="mt-2 text-sm text-gray-400">
									Selected:{" "}
									{selectedCourses.join(", ") || "None"}
								</div>
							</div>

							{/* Registration Date */}
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Registration Date *
								</label>
								<input
									type="date"
									name="registrationDate"
									value={formData.registrationDate}
									onChange={handleInputChange}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
									required
								/>
							</div>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex gap-4 pt-6 border-t border-gray-700">
						<button
							type="submit"
							disabled={loading}
							className="flex-1 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Submitting..." : "Submit Registration"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default StudentRegistration;
