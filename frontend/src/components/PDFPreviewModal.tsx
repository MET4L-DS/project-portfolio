import React, { useState } from "react";
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
		<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="bg-gray-800 text-white p-4 flex justify-between items-center">
					<div>
						<h2 className="text-xl font-bold">
							Registration Form Preview
						</h2>
						<p className="text-gray-300">
							Form No: {student.formNo} - {student.studentName}
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-300 hover:text-white transition-colors p-2"
					>
						✕
					</button>
				</div>

				{/* PDF Preview Content */}
				<div className="bg-gray-100 p-4 overflow-auto max-h-[calc(90vh-8rem)]">
					<div className="bg-white shadow-lg rounded-lg overflow-hidden">
						<PDFViewer
							style={{ width: "100%", height: "70vh" }}
							showToolbar={false}
						>
							<RegistrationPDFDocument student={student} />
						</PDFViewer>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="bg-gray-50 p-4 border-t flex justify-between items-center">
					<div className="text-sm text-gray-600">
						Preview your registration form before downloading or
						printing
					</div>
					<div className="flex gap-3">
						<button
							onClick={handlePrintForm}
							className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition-colors flex items-center gap-2"
						>
							🖨️ Print
						</button>
						<button
							onClick={handleDownloadPDF}
							disabled={isGenerating}
							className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isGenerating ? (
								<>
									<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
									Generating...
								</>
							) : (
								<>📄 Download PDF</>
							)}
						</button>
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-400 transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PDFPreviewModal;
