import React, { useState, useEffect } from "react";
import { candidatesAPI } from "../services/api";
import CandidateRegistrationPDFDocument from "./CandidateRegistrationPDFDocument";
import {
	generatePDFBlob,
	downloadBlob,
	printBlob,
} from "../utils/pdfGenerator";

interface CandidateRegistrationSuccessProps {
	formNo: string;
	onClose: () => void;
}

interface CandidateData {
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

export const CandidateRegistrationSuccess: React.FC<
	CandidateRegistrationSuccessProps
> = ({ formNo, onClose }) => {
	const [candidateData, setCandidateData] = useState<CandidateData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchCandidateData();
	}, [formNo]);

	const fetchCandidateData = async () => {
		try {
			setLoading(true);
			const response = await candidatesAPI.getCandidateByFormNo(formNo);

			if (response.success) {
				const candidate = response.data;
				setCandidateData({
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
					registrationDate:
						candidate.registrationDate || candidate.createdAt,
					status: candidate.status,
				});
			} else {
				setError("Failed to load registration details");
			}
		} catch (err: any) {
			console.error("Error fetching candidate data:", err);
			setError("Failed to load registration details");
		} finally {
			setLoading(false);
		}
	};

	const handleDownloadPDF = async () => {
		if (!candidateData) return;

		try {
			console.log(
				"Creating PDF document for candidate:",
				candidateData.formNo
			);
			const pdfDocument = (
				<CandidateRegistrationPDFDocument
					candidateData={candidateData}
				/>
			);
			const blob = await generatePDFBlob(pdfDocument);
			downloadBlob(
				blob,
				`candidate-application-${candidateData.formNo}.pdf`
			);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		}
	};

	const handlePrintForm = async () => {
		if (!candidateData) return;

		try {
			console.log(
				"Creating PDF document for printing:",
				candidateData.formNo
			);
			const pdfDocument = (
				<CandidateRegistrationPDFDocument
					candidateData={candidateData}
				/>
			);
			const blob = await generatePDFBlob(pdfDocument);
			printBlob(blob);
		} catch (error) {
			console.error("Error printing form:", error);
			alert("Failed to print form. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
				<div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center my-4 sm:my-8">
					<div className="text-white text-xl">
						Loading registration details...
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
				<div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center max-w-md my-4 sm:my-8">
					<div className="text-red-400 text-xl mb-4">{error}</div>
					<button
						onClick={onClose}
						className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
				<div className="bg-gray-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-screen overflow-y-auto my-4 sm:my-8">
					{/* Success Header */}
					<div className="text-center mb-8">
						<div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-10 h-10 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-white mb-2">
							Registration Successful!
						</h2>
						<p className="text-gray-300 text-lg">
							Your application has been submitted successfully
						</p>
					</div>

					{/* Registration Details */}
					<div className="bg-gray-700 rounded-xl p-6 mb-6">
						<h3 className="text-xl font-semibold text-white mb-4">
							Registration Details
						</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-400">
									Form Number:
								</span>
								<div className="text-yellow-400 font-semibold text-lg">
									{formNo}
								</div>
							</div>
							<div>
								<span className="text-gray-400">Status:</span>
								<div className="text-blue-400 font-semibold">
									Pending Review
								</div>
							</div>
							<div className="col-span-2">
								<span className="text-gray-400">
									Registration Date:
								</span>
								<div className="text-white">
									{new Date().toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>

					{/* Important Information */}
					<div className="bg-blue-900/30 border border-blue-600 rounded-xl p-6 mb-6">
						<h3 className="text-lg font-semibold text-blue-300 mb-3">
							📋 Important Information
						</h3>
						<ul className="text-blue-200 text-sm space-y-2">
							<li>
								• Keep your form number{" "}
								<strong>{formNo}</strong> safe for future
								reference
							</li>
							<li>
								• Your application is currently under review
							</li>
							<li>
								• You will be contacted regarding the status of
								your application
							</li>
							<li>
								• Download your application form for your
								records
							</li>
						</ul>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-4">
						<button
							onClick={handleDownloadPDF}
							disabled={!candidateData}
							className="flex-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg
								className="w-5 h-5"
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
							Download Application
						</button>
						<button
							onClick={handlePrintForm}
							disabled={!candidateData}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<svg
								className="w-5 h-5"
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
							className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
						>
							Close
						</button>
					</div>

					{/* Contact Information */}
					<div className="mt-6 text-center text-gray-400 text-sm">
						<p>
							For any questions, please contact us at{" "}
							<a
								className="text-yellow-400"
								href="mailto:sankalpentertainment360@gmail.com"
							>
								sankalpentertainment360@gmail.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
