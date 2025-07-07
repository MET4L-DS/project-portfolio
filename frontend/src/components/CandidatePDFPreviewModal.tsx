import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import CandidateRegistrationPDFDocument from "./CandidateRegistrationPDFDocument";
import {
	generatePDFBlob,
	downloadBlob,
	printBlob,
} from "../utils/pdfGenerator";

interface Candidate {
	_id: string;
	formNo: string;
	eventName: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	address: string;
	educationalLevel: string;
	gender: string;
	height: string;
	parentFirstName: string;
	parentLastName: string;
	parentOccupation: string;
	parentContactNo: string;
	parentDeclaration: boolean;
	photoUrl?: string;
	registrationDate: string;
	status: string;
}

interface CandidatePDFPreviewModalProps {
	candidate: Candidate;
	isOpen: boolean;
	onClose: () => void;
}

const CandidatePDFPreviewModal: React.FC<CandidatePDFPreviewModalProps> = ({
	candidate,
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
			const candidateData = {
				formNo: candidate.formNo,
				eventName: candidate.eventName,
				firstName: candidate.firstName,
				lastName: candidate.lastName,
				dateOfBirth: candidate.dateOfBirth,
				address: candidate.address,
				educationalLevel: candidate.educationalLevel,
				gender: candidate.gender,
				height: candidate.height,
				parentFirstName: candidate.parentFirstName,
				parentLastName: candidate.parentLastName,
				parentOccupation: candidate.parentOccupation,
				parentContactNo: candidate.parentContactNo,
				parentDeclaration: candidate.parentDeclaration,
				photoUrl: candidate.photoUrl,
				registrationDate: candidate.registrationDate,
				status: candidate.status,
			};

			const pdfDocument = (
				<CandidateRegistrationPDFDocument
					candidateData={candidateData}
				/>
			);
			const blob = await generatePDFBlob(pdfDocument);
			downloadBlob(blob, `candidate-${candidate.formNo}.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePrintPDF = async () => {
		setIsGenerating(true);
		try {
			const candidateData = {
				formNo: candidate.formNo,
				eventName: candidate.eventName,
				firstName: candidate.firstName,
				lastName: candidate.lastName,
				dateOfBirth: candidate.dateOfBirth,
				address: candidate.address,
				educationalLevel: candidate.educationalLevel,
				gender: candidate.gender,
				height: candidate.height,
				parentFirstName: candidate.parentFirstName,
				parentLastName: candidate.parentLastName,
				parentOccupation: candidate.parentOccupation,
				parentContactNo: candidate.parentContactNo,
				parentDeclaration: candidate.parentDeclaration,
				photoUrl: candidate.photoUrl,
				registrationDate: candidate.registrationDate,
				status: candidate.status,
			};

			const pdfDocument = (
				<CandidateRegistrationPDFDocument
					candidateData={candidateData}
				/>
			);
			const blob = await generatePDFBlob(pdfDocument);
			printBlob(blob);
		} catch (error) {
			console.error("Error printing PDF:", error);
			alert("Failed to print PDF. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const candidateData = {
		formNo: candidate.formNo,
		eventName: candidate.eventName,
		firstName: candidate.firstName,
		lastName: candidate.lastName,
		dateOfBirth: candidate.dateOfBirth,
		address: candidate.address,
		educationalLevel: candidate.educationalLevel,
		gender: candidate.gender,
		height: candidate.height,
		parentFirstName: candidate.parentFirstName,
		parentLastName: candidate.parentLastName,
		parentOccupation: candidate.parentOccupation,
		parentContactNo: candidate.parentContactNo,
		parentDeclaration: candidate.parentDeclaration,
		photoUrl: candidate.photoUrl,
		registrationDate: candidate.registrationDate,
		status: candidate.status,
	};

	return (
		<div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
			<div className="bg-gray-800 rounded-2xl w-full max-w-6xl min-h-[90vh] sm:h-[90vh] flex flex-col my-4 sm:my-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b border-gray-700 gap-3">
					<div className="flex-1">
						<h2 className="text-xl sm:text-2xl font-bold text-white">
							Candidate Application Preview
						</h2>
						<p className="text-sm sm:text-base text-gray-300">
							Form No: {candidate.formNo} - {candidate.firstName}{" "}
							{candidate.lastName}
						</p>
					</div>
					<div className="flex flex-wrap gap-2 sm:gap-3">
						<button
							onClick={handleDownloadPDF}
							disabled={isGenerating}
							className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
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
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<span className="hidden sm:inline">
										Download
									</span>
								</>
							)}
						</button>
						<button
							onClick={handlePrintPDF}
							disabled={isGenerating}
							className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
								/>
							</svg>
							<span className="hidden sm:inline">Print</span>
						</button>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold px-2"
						>
							×
						</button>
					</div>
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
								Please use the download or print buttons above
								to view the document.
							</p>
							<div className="text-sm text-gray-400">
								Form: {candidate.formNo} - {candidate.firstName}{" "}
								{candidate.lastName}
							</div>
						</div>
					) : (
						// Desktop PDF viewer
						<div className="w-full h-full border border-gray-600 rounded-lg overflow-hidden bg-white">
							<PDFViewer
								style={{
									width: "100%",
									height: "100%",
									minHeight: "50vh",
									border: "none",
								}}
								showToolbar={false}
							>
								<CandidateRegistrationPDFDocument
									candidateData={candidateData}
								/>
							</PDFViewer>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-gray-400">
						<p>📄 Application for {candidate.eventName}</p>
						<p>Powered by Sankalp Entertainment</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CandidatePDFPreviewModal;
