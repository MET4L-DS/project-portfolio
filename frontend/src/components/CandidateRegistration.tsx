import React, { useState } from "react";
import { candidatesAPI } from "../services/api";

interface CandidateRegistrationProps {
	eventId: string;
	eventName: string;
	onClose: () => void;
	onSuccess: (formNo: string) => void;
}

const CandidateRegistration: React.FC<CandidateRegistrationProps> = ({
	eventId,
	eventName,
	onClose,
	onSuccess,
}) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		address: "",
		educationalLevel: "",
		gender: "",
		height: "",
		parentFirstName: "",
		parentLastName: "",
		parentOccupation: "",
		parentContactNo: "",
		parentDeclaration: false,
	});

	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target;
		if (type === "checkbox") {
			const checkbox = e.target as HTMLInputElement;
			setFormData((prev) => ({
				...prev,
				[name]: checkbox.checked,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setError("Please select a valid image file");
				return;
			}

			// Validate file size (200KB)
			if (file.size > 200 * 1024) {
				setError("Image size should be less than 200KB");
				return;
			}

			setPhotoFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setPhotoPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
			setError(null);
		}
	};

	const validateForm = () => {
		const requiredFields = [
			"firstName",
			"lastName",
			"dateOfBirth",
			"address",
			"educationalLevel",
			"gender",
			"height",
			"parentFirstName",
			"parentLastName",
			"parentOccupation",
			"parentContactNo",
		];

		for (const field of requiredFields) {
			if (!formData[field as keyof typeof formData]) {
				setError(
					`Please fill in the ${field
						.replace(/([A-Z])/g, " $1")
						.toLowerCase()}`
				);
				return false;
			}
		}

		if (!formData.parentDeclaration) {
			setError("Parent's declaration must be accepted");
			return false;
		}

		// Validate date of birth (should be in the past)
		const dob = new Date(formData.dateOfBirth);
		if (dob >= new Date()) {
			setError("Date of birth must be in the past");
			return false;
		}

		// Validate phone number
		if (!/^[0-9]{10}$/.test(formData.parentContactNo.replace(/\s/g, ""))) {
			setError("Please enter a valid 10-digit contact number");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);

			const submitData = new FormData();
			submitData.append("eventId", eventId);

			// Append all form fields
			Object.entries(formData).forEach(([key, value]) => {
				submitData.append(key, value.toString());
			});

			// Append photo if selected
			if (photoFile) {
				submitData.append("photo", photoFile);
			}

			const response = await candidatesAPI.registerCandidate(submitData);

			if (response.success) {
				onSuccess(response.data.formNo);
			} else {
				setError(response.message || "Registration failed");
			}
		} catch (err: any) {
			console.error("Registration error:", err);
			setError(
				err.response?.data?.message ||
					"Registration failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="text-2xl font-bold text-white mb-2">
								{eventName} – Application Form
							</h2>
							<p className="text-gray-400">
								Fill in all details in BLOCK letters
							</p>
						</div>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white text-2xl font-bold"
						>
							×
						</button>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-6 bg-red-900/50 border border-red-600 rounded-lg p-4">
							<p className="text-red-300">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Applicant Details */}
						<div>
							<h3 className="text-xl font-semibold text-white mb-4">
								Applicant Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										First Name *
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter first name"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Last Name *
									</label>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter last name"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Date of Birth (DD/MM/YY) *
									</label>
									<input
										type="date"
										name="dateOfBirth"
										value={formData.dateOfBirth}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Gender *
									</label>
									<select
										name="gender"
										value={formData.gender}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
									>
										<option value="">Select Gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div className="md:col-span-2">
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Address *
									</label>
									<textarea
										name="address"
										value={formData.address}
										onChange={handleInputChange}
										rows={3}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter complete address"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Educational Level *
									</label>
									<input
										type="text"
										name="educationalLevel"
										value={formData.educationalLevel}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="e.g., High School, Graduate, etc."
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Height (in feet) *
									</label>
									<input
										type="text"
										name="height"
										value={formData.height}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="e.g., 5'6&quot;"
									/>
								</div>
							</div>
						</div>

						{/* Parent's Information */}
						<div>
							<h3 className="text-xl font-semibold text-white mb-4">
								Parent's Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Parent First Name *
									</label>
									<input
										type="text"
										name="parentFirstName"
										value={formData.parentFirstName}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter parent's first name"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Parent Last Name *
									</label>
									<input
										type="text"
										name="parentLastName"
										value={formData.parentLastName}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter parent's last name"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Occupation *
									</label>
									<input
										type="text"
										name="parentOccupation"
										value={formData.parentOccupation}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter parent's occupation"
										style={{ textTransform: "uppercase" }}
									/>
								</div>
								<div>
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Contact No. *
									</label>
									<input
										type="tel"
										name="parentContactNo"
										value={formData.parentContactNo}
										onChange={handleInputChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
										placeholder="Enter 10-digit phone number"
									/>
								</div>
							</div>
						</div>

						{/* Photo Upload */}
						<div>
							<h3 className="text-xl font-semibold text-white mb-4">
								Photo (Passport Size)
							</h3>
							<div className="flex items-start gap-6">
								<div className="flex-1">
									<label className="block text-gray-300 text-sm font-medium mb-2">
										Upload Photo (Optional)
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={handlePhotoChange}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black file:font-semibold hover:file:bg-yellow-300"
									/>
									<p className="text-gray-400 text-sm mt-2">
										Maximum file size: 200KB. Supported
										formats: JPG, PNG, WEBP
									</p>
								</div>
								{photoPreview && (
									<div className="w-32 h-40 bg-gray-700 rounded-lg overflow-hidden">
										<img
											src={photoPreview}
											alt="Photo Preview"
											className="w-full h-full object-cover"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Parent's Declaration */}
						<div>
							<h3 className="text-xl font-semibold text-white mb-4">
								Parent's Authority Declaration
							</h3>
							<div className="bg-gray-700 p-4 rounded-lg">
								<p className="text-gray-300 mb-4">
									I, Mr./Mrs.{" "}
									<span className="text-yellow-400">
										{formData.parentFirstName}{" "}
										{formData.parentLastName}
									</span>{" "}
									(Father/Mother/Guardian of Mr./Miss{" "}
									<span className="text-yellow-400">
										{formData.firstName} {formData.lastName}
									</span>
									), have no objection to his/her
									participation in{" "}
									<span className="text-yellow-400">
										{eventName}
									</span>
									. I will fully co-operate and support
									him/her in this program.
								</p>
								<label className="flex items-center">
									<input
										type="checkbox"
										name="parentDeclaration"
										checked={formData.parentDeclaration}
										onChange={handleInputChange}
										className="mr-3 h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded bg-gray-700"
									/>
									<span className="text-white font-medium">
										I agree to the above declaration *
									</span>
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<div className="flex gap-4 pt-6">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
								disabled={loading}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								disabled={loading}
							>
								{loading
									? "Submitting..."
									: "Submit Application"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CandidateRegistration;
