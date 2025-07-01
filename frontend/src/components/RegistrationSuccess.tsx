import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";
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

interface RegistrationSuccessProps {
	formNo: string;
	onClose: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
	formNo,
	onClose,
}) => {
	const [student, setStudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const response = await studentAPI.getByFormNo(formNo);
				setStudent(response.student);
			} catch (error) {
				console.error("Error fetching student data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStudentData();
	}, [formNo]);

	const handleDownloadPDF = async () => {
		if (!student) return;

		try {
			console.log("Creating PDF document for student:", student.formNo);
			const pdfDocument = <RegistrationPDFDocument student={student} />;
			const blob = await generatePDFBlob(pdfDocument);
			downloadBlob(blob, `registration-${student.formNo}.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		}
	};

	const handlePrintForm = async () => {
		if (!student) return;

		try {
			console.log("Creating PDF document for printing:", student.formNo);
			const pdfDocument = <RegistrationPDFDocument student={student} />;
			const blob = await generatePDFBlob(pdfDocument);
			printBlob(blob);
		} catch (error) {
			console.error("Error printing form:", error);
			alert("Failed to print form. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
					<div className="text-4xl mb-4">⏳</div>
					<h2 className="text-xl font-bold text-white mb-4">
						Loading...
					</h2>
					<p className="text-gray-300">
						Fetching registration details...
					</p>
				</div>
			</div>
		);
	}

	if (!student) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
					<div className="text-4xl mb-4">❌</div>
					<h2 className="text-xl font-bold text-white mb-4">Error</h2>
					<p className="text-gray-300 mb-6">
						Could not load registration details.
					</p>
					<button
						onClick={onClose}
						className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Success Modal */}
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
						Please save your form number for future reference. You
						can download or print your registration form below.
					</p>
					<div className="flex flex-col gap-3">
						<div className="flex gap-3">
							<button
								onClick={handleDownloadPDF}
								className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
							>
								📄 Download PDF
							</button>
							<button
								onClick={handlePrintForm}
								className="flex-1 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition-colors flex items-center justify-center gap-2"
							>
								🖨️ Print Form
							</button>
						</div>
						<button
							onClick={onClose}
							className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegistrationSuccess;
