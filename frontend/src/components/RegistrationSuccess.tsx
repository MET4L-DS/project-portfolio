import React from "react";
import { studentAPI } from "../services/api";

interface RegistrationSuccessProps {
	formNo: string;
	onClose: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
	formNo,
	onClose,
}) => {
	const handleDownloadPDF = async () => {
		try {
			await studentAPI.downloadRegistrationPDF(formNo);
		} catch (error) {
			console.error("Error downloading PDF:", error);
			// Fallback to opening PDF in new tab
			const pdfUrl = `${
				import.meta.env.VITE_API_URL || "http://localhost:5000"
			}/api/students/pdf/${formNo}`;
			window.open(pdfUrl, "_blank");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
				<div className="text-6xl mb-4">🎉</div>
				<h2 className="text-2xl font-bold text-white mb-4">
					Registration Successful!
				</h2>
				<div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
					<p className="text-green-300 mb-2">
						Your registration has been submitted successfully.
					</p>
					<p className="text-white font-semibold">
						Form Number:{" "}
						<span className="text-yellow-400">{formNo}</span>
					</p>
				</div>
				<p className="text-gray-300 mb-6">
					Please save your form number for future reference. You can
					download your registration form as a PDF below.
				</p>
				<div className="flex gap-3">
					<button
						onClick={handleDownloadPDF}
						className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
					>
						📄 Download PDF
					</button>
					<button
						onClick={onClose}
						className="flex-1 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegistrationSuccess;
