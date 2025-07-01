import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";

// Using default fonts for better compatibility
// Font registration can be added later if needed

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

interface RegistrationPDFDocumentProps {
	student: Student;
}

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 15,
		fontSize: 11,
	},
	formContainer: {
		border: "2px solid #000000",
		padding: 15,
		marginBottom: 5,
	},
	header: {
		textAlign: "center",
		marginBottom: 15,
		borderBottom: "2px solid #000000",
		paddingBottom: 10,
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 10,
	},
	logo: {
		width: 100,
		height: 100,
		padding: -25,
		marginBottom: 5,
	},
	schoolName: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 3,
		color: "#000000",
	},
	schoolSubtitle: {
		fontSize: 14,
		color: "#666666",
		marginBottom: 8,
	},
	formTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 8,
		color: "#000000",
	},
	formNoBox: {
		position: "absolute",
		top: 20,
		right: 20,
		border: "2px solid #000000",
		padding: 10,
		backgroundColor: "#FFF3CD",
	},
	formNoText: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#000000",
	},
	mainContent: {
		flexDirection: "row",
		marginBottom: 15,
	},
	leftColumn: {
		flex: 2,
		marginRight: 15,
	},
	rightColumn: {
		flex: 1,
	},
	photoBox: {
		width: 100,
		height: 120,
		border: "2px solid #000000",
		marginBottom: 15,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F8F9FA",
	},
	photoPlaceholder: {
		fontSize: 9,
		textAlign: "center",
		color: "#666666",
		fontWeight: "bold",
	},
	photo: {
		width: "100%",
		height: "100%",
	},
	formRow: {
		flexDirection: "row",
		marginBottom: 8,
		alignItems: "center",
	},
	formLabel: {
		fontWeight: "bold",
		minWidth: 120,
		marginRight: 8,
		color: "#000000",
		fontSize: 10,
	},
	formValue: {
		flex: 1,
		borderBottom: "1px solid #000000",
		paddingBottom: 1,
		paddingLeft: 3,
		paddingRight: 3,
		minHeight: 14,
		color: "#000000",
		fontSize: 10,
	},
	addressSection: {
		marginBottom: 8,
	},
	addressRow: {
		flexDirection: "row",
		marginBottom: 4,
		alignItems: "center",
	},
	genderAgeRow: {
		flexDirection: "row",
		marginBottom: 8,
		alignItems: "center",
		justifyContent: "space-between",
	},
	genderSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		marginRight: 20,
	},
	ageSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	ageLabel: {
		fontWeight: "bold",
		minWidth: 30,
		marginRight: 10,
		color: "#000000",
	},
	ageValue: {
		borderBottom: "1px solid #000000",
		paddingBottom: 2,
		paddingLeft: 5,
		paddingRight: 5,
		minWidth: 40,
		textAlign: "center",
		color: "#000000",
	},
	coursesSection: {
		border: "1px solid #000000",
		padding: 10,
		marginBottom: 15,
		backgroundColor: "#F8F9FA",
	},
	coursesTitle: {
		fontWeight: "bold",
		marginBottom: 8,
		color: "#000000",
		fontSize: 11,
	},
	coursesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	coursePill: {
		backgroundColor: "#4F46E5",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginRight: 6,
		marginBottom: 6,
	},
	coursePillText: {
		fontSize: 9,
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	signatureSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: 15,
	},
	signatureBox: {
		width: 160,
		textAlign: "center",
	},
	signatureLine: {
		borderBottom: "1px solid #000000",
		height: 40,
		marginBottom: 6,
	},
	signatureLabel: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#000000",
		marginBottom: 2,
	},
	termsSection: {
		marginTop: 15,
		padding: 10,
		backgroundColor: "#F8F9FA",
		border: "1px solid #E0E0E0",
	},
	termsTitle: {
		fontSize: 11,
		fontWeight: "bold",
		marginBottom: 6,
		color: "#000000",
	},
	termsText: {
		fontSize: 8,
		color: "#666666",
		marginBottom: 2,
	},
});

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("en-IN");
};

const RegistrationPDFDocument: React.FC<RegistrationPDFDocumentProps> = ({
	student,
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Form Number Box */}
			<View style={styles.formNoBox}>
				<Text style={styles.formNoText}>Form No: {student.formNo}</Text>
			</View>

			<View style={styles.formContainer}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<Image
							style={styles.logo}
							src="/logo/sankalp_school_2.jpg"
						/>
					</View>
					<Text style={styles.schoolName}>
						SANKALP SCHOOL OF ART AND SKILLS
					</Text>
					<Text style={styles.schoolSubtitle}>
						"Confidence Starts Here"
					</Text>
					<Text style={styles.formTitle}>
						STUDENT REGISTRATION FORM
					</Text>
				</View>

				{/* Main Content */}
				<View style={styles.mainContent}>
					{/* Left Column */}
					<View style={styles.leftColumn}>
						{/* Student Name */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>Student Name:</Text>
							<Text style={styles.formValue}>
								{student.studentName}
							</Text>
						</View>

						{/* Address Section */}
						<View style={styles.addressSection}>
							<View style={styles.addressRow}>
								<Text style={styles.formLabel}>Address:</Text>
								<Text style={styles.formValue}>
									{student.address.line1}
								</Text>
							</View>
							<View style={styles.addressRow}>
								<Text style={styles.formLabel}></Text>
								<Text style={styles.formValue}>
									{student.address.line2 || ""}
								</Text>
							</View>
							<View style={styles.addressRow}>
								<Text style={styles.formLabel}></Text>
								<Text style={styles.formValue}>
									{student.address.line3 || ""}
								</Text>
							</View>
						</View>

						{/* Phone Number */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>Phone Number:</Text>
							<Text style={styles.formValue}>
								{student.phoneNumber}
							</Text>
						</View>

						{/* Gender and Age */}
						<View style={styles.genderAgeRow}>
							<View style={styles.genderSection}>
								<Text style={styles.formLabel}>Gender:</Text>
								<Text style={styles.formValue}>
									{student.gender}
								</Text>
							</View>
							<View style={styles.ageSection}>
								<Text style={styles.ageLabel}>Age:</Text>
								<Text style={styles.ageValue}>
									{student.age}
								</Text>
							</View>
						</View>

						{/* Date of Birth */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>Date of Birth:</Text>
							<Text style={styles.formValue}>
								{formatDate(student.dateOfBirth)}
							</Text>
						</View>

						{/* Parents Name */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>Parents' Name:</Text>
							<Text style={styles.formValue}>
								{student.parentsName}
							</Text>
						</View>

						{/* Parents Number */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>
								Parents' Number:
							</Text>
							<Text style={styles.formValue}>
								{student.parentsNumber}
							</Text>
						</View>

						{/* Registration Date */}
						<View style={styles.formRow}>
							<Text style={styles.formLabel}>
								Registration Date:
							</Text>
							<Text style={styles.formValue}>
								{formatDate(student.registrationDate)}
							</Text>
						</View>
					</View>

					{/* Right Column - Photo */}
					<View style={styles.rightColumn}>
						<View style={styles.photoBox}>
							{student.photoUrl ? (
								<Image
									style={styles.photo}
									src={student.photoUrl}
								/>
							) : (
								<Text style={styles.photoPlaceholder}>
									PASSPORT{"\n"}SIZE{"\n"}PHOTO
								</Text>
							)}
						</View>
					</View>
				</View>

				{/* Courses Section */}
				<View style={styles.coursesSection}>
					<Text style={styles.coursesTitle}>SELECTED COURSES:</Text>
					<View style={styles.coursesGrid}>
						{student.courses.map((course) => (
							<View key={course} style={styles.coursePill}>
								<Text style={styles.coursePillText}>
									{course}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Signature Section */}
				<View style={styles.signatureSection}>
					<View style={styles.signatureBox}>
						<View style={styles.signatureLine}></View>
						<Text style={styles.signatureLabel}>
							Student/Parent Signature
						</Text>
						<Text style={styles.signatureLabel}>
							Date: ___________
						</Text>
					</View>
					<View style={styles.signatureBox}>
						<View style={styles.signatureLine}></View>
						<Text style={styles.signatureLabel}>Approved By</Text>
						<Text style={styles.signatureLabel}>
							Date: ___________
						</Text>
					</View>
				</View>

				{/* Terms and Conditions */}
				<View style={styles.termsSection}>
					<Text style={styles.termsTitle}>TERMS & CONDITIONS:</Text>
					<Text style={styles.termsText}>
						• All information provided is true and accurate to the
						best of my knowledge.
					</Text>
					<Text style={styles.termsText}>
						• I understand that fees once paid are non-refundable.
					</Text>
					<Text style={styles.termsText}>
						• I agree to follow all school rules and regulations.
					</Text>
					<Text style={styles.termsText}>
						• The school reserves the right to dismiss any student
						for misconduct.
					</Text>
					<Text style={styles.termsText}>
						• All students must maintain 80% attendance to be
						eligible for certification.
					</Text>
				</View>
			</View>
		</Page>
	</Document>
);

export default RegistrationPDFDocument;
