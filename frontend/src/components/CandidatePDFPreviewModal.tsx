import React, { useState } from "react";
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
			const filename = `candidate-application-${candidate.formNo}.pdf`;
			downloadBlob(blob, filename);
		} catch (error) {
			console.error("Error downloading PDF:", error);
			alert("Failed to download PDF. Please try again.");
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
		<div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex justify-between items-center p-6 border-b border-gray-700">
					<div>
						<h2 className="text-2xl font-bold text-white">
							Candidate Application Preview
						</h2>
						<p className="text-gray-400">
							{candidate.firstName} {candidate.lastName} - Form
							No: {candidate.formNo}
						</p>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleDownloadPDF}
							disabled={isGenerating}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isGenerating ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Generating...
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
									Download
								</>
							)}
						</button>
						<button
							onClick={handlePrintPDF}
							disabled={isGenerating}
							className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
							Print
						</button>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white text-2xl font-bold px-2"
						>
							×
						</button>
					</div>
				</div>

				{/* PDF Viewer */}
				<div className="flex-1 p-6">
					<div className="w-full h-full border border-gray-600 rounded-lg overflow-hidden bg-white">
						<PDFViewer
							style={{
								width: "100%",
								height: "100%",
								border: "none",
							}}
						>
							<CandidateRegistrationPDFDocument
								candidateData={candidateData}
							/>
						</PDFViewer>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-gray-700 bg-gray-800/50">
					<div className="flex justify-between items-center text-sm text-gray-400">
						<p>📄 Application for {candidate.eventName}</p>
						<p>Powered by Sankalp Entertainment</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CandidatePDFPreviewModal;
