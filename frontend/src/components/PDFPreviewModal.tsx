import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import RegistrationPDFDocument from "./RegistrationPDFDocument";
import {
	generatePDFBlob,
	downloadBlob,
	printBlob,
} from "../utils/pdfGenerator";

interface Student {
	_id: string;
	formNo: string;
	studentName: string;
	phoneNumber: string;
	gender: string;
	age: number;
	dateOfBirth: string;
	address: {
		line1: string;
		line2?: string;
		line3?: string;
	};
	parentsName: string;
	parentsNumber: string;
	courses: string[];
	photoUrl?: string;
	registrationDate: string;
	status: "Pending" | "Approved" | "Rejected";
}

interface PDFPreviewModalProps {
	student: Student;
	isOpen: boolean;
	onClose: () => void;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
	student,
	isOpen,
	onClose,
}) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Detect mobile device
	useEffect(() => {
		const checkMobile = () => {
			const userAgent = navigator.userAgent.toLowerCase();
			const mobileKeywords = [
				"mobile",
				"android",
				"iphone",
				"ipad",
				"ipod",
				"blackberry",
				"windows phone",
			];
			const isMobileDevice =
				mobileKeywords.some((keyword) => userAgent.includes(keyword)) ||
				window.innerWidth < 768;
			setIsMobile(isMobileDevice);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isOpen) return null;

	const handleDownloadPDF = async () => {
		setIsGenerating(true);
		try {
			const pdfDocument = <RegistrationPDFDocument student={student} />;
			const blob = await generatePDFBlob(pdfDocument);
			downloadBlob(blob, `registration-${student.formNo}.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePrintForm = async () => {
		try {
			const pdfDocument = <RegistrationPDFDocument student={student} />;
			const blob = await generatePDFBlob(pdfDocument);
			printBlob(blob);
		} catch (error) {
			console.error("Error printing form:", error);
			alert("Failed to print form. Please try again.");
		}
	};

	return (
		<div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
			<div className="bg-gray-800 rounded-2xl w-full max-w-5xl min-h-[90vh] sm:h-[90vh] flex flex-col my-4 sm:my-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b border-gray-700 gap-3">
					<div className="flex-1">
						<h2 className="text-xl sm:text-2xl font-bold text-white">
							Student Registration Preview
						</h2>
						<p className="text-sm sm:text-base text-gray-300">
							Form No: {student.formNo} - {student.studentName}
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold px-2"
					>
						×
					</button>
				</div>

				{/* PDF Viewer */}
				<div className="flex-1 p-3 sm:p-6">
					{isMobile ? (
						// Mobile fallback - show message and download/print buttons
						<div className="w-full h-full border border-gray-600 rounded-lg bg-gray-700 flex flex-col items-center justify-center p-6 text-center min-h-[50vh]">
							<div className="text-6xl mb-4">📄</div>
							<h3 className="text-xl font-bold text-white mb-4">
								PDF Preview
							</h3>
							<p className="text-gray-300 mb-6">
								PDF preview is not available on mobile devices.
								Please use the download or print buttons below
								to view the document.
							</p>
							<div className="text-sm text-gray-400">
								Form: {student.formNo} - {student.studentName}
							</div>
						</div>
					) : (
						// Desktop PDF viewer
						<div className="w-full h-full border border-gray-600 rounded-lg overflow-hidden bg-white">
							<PDFViewer
								style={{
									width: "100%",
									height: "100%",
									minHeight: "60vh",
									border: "none",
								}}
								showToolbar={false}
							>
								<RegistrationPDFDocument student={student} />
							</PDFViewer>
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50">
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
						<div className="flex-1 text-xs sm:text-sm text-gray-400">
							Preview your registration form before downloading or
							printing
						</div>
						<div className="flex flex-wrap gap-2 sm:gap-3">
							<button
								onClick={handlePrintForm}
								className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
							>
								<span className="text-sm sm:text-base">🖨️</span>
								<span className="hidden sm:inline">Print</span>
							</button>
							<button
								onClick={handleDownloadPDF}
								disabled={isGenerating}
								className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
							>
								{isGenerating ? (
									<>
										<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
										<span className="hidden sm:inline">
											Generating...
										</span>
									</>
								) : (
									<>
										<span className="text-sm sm:text-base">
											📄
										</span>
										<span className="hidden sm:inline">
											Download PDF
										</span>
									</>
								)}
							</button>
							<button
								onClick={onClose}
								className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PDFPreviewModal;
