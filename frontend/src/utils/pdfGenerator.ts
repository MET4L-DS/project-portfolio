import { pdf } from "@react-pdf/renderer";

export interface PDFGenerationOptions {
	filename?: string;
}

// This will be used by components that can import the PDF document directly
export const generatePDFBlob = async (pdfDocument: any): Promise<Blob> => {
	try {
		console.log("Generating PDF blob...");
		const blob = await pdf(pdfDocument).toBlob();
		console.log("PDF blob generated successfully");
		return blob;
	} catch (error) {
		console.error("Error in generatePDFBlob:", error);
		throw error;
	}
};

export const downloadBlob = (blob: Blob, filename: string): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const openBlobInNewTab = (blob: Blob): void => {
	const url = URL.createObjectURL(blob);
	window.open(url);
	URL.revokeObjectURL(url);
};

export const printBlob = (blob: Blob): void => {
	try {
		console.log("Creating print URL...");
		const url = URL.createObjectURL(blob);
		console.log("Opening print window...");
		const printWindow = window.open(url);

		if (printWindow) {
			printWindow.onload = () => {
				console.log("Print window loaded, triggering print...");
				printWindow.print();
			};
		} else {
			throw new Error("Failed to open print window - popup blocked?");
		}

		// Clean up after a delay
		setTimeout(() => {
			URL.revokeObjectURL(url);
		}, 1000);
	} catch (error) {
		console.error("Error in printBlob:", error);
		throw error;
	}
};
