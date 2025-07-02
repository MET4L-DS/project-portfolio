import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 30,
		fontFamily: "Helvetica",
	},
	header: {
		marginBottom: 20,
		textAlign: "center",
		borderBottom: "2pt solid #000",
		paddingBottom: 15,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		textTransform: "uppercase",
	},
	subtitle: {
		fontSize: 12,
		marginBottom: 5,
		color: "#666",
	},
	section: {
		marginBottom: 10,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10,
		backgroundColor: "#f0f0f0",
		padding: 5,
		textTransform: "uppercase",
	},
	row: {
		flexDirection: "row",
		marginBottom: 8,
	},
	field: {
		flex: 1,
		marginRight: 10,
	},
	label: {
		fontSize: 10,
		fontWeight: "bold",
		marginBottom: 2,
	},
	value: {
		fontSize: 11,
		borderBottom: "1pt solid #000",
		borderBottomColor: "#000",
		paddingBottom: 2,
		minHeight: 15,
		textTransform: "uppercase",
	},
	fullWidth: {
		flex: 1,
	},
	declarationBox: {
		border: "1pt solid #000",
		borderColor: "#000",
		padding: 10,
		marginBottom: 20,
	},
	declarationText: {
		fontSize: 10,
		lineHeight: 1.4,
		marginBottom: 10,
	},
	underlinedName: {
		textDecoration: "underline",
		fontWeight: "bold",
	},
	checkbox: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
	},
	checkboxSquare: {
		width: 12,
		height: 12,
		border: "1pt solid #000",
		borderColor: "#000",
		marginRight: 5,
		backgroundColor: "#000",
	},
	checkboxLabel: {
		fontSize: 10,
		fontWeight: "bold",
	},
	signatureSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 0,
	},
	signatureBox: {
		flex: 1,
		textAlign: "center",
		marginHorizontal: 10,
	},
	signatureLine: {
		borderBottom: "1pt solid #000",
		borderBottomColor: "#000",
		height: 40,
		marginBottom: 5,
	},
	signatureLabel: {
		fontSize: 10,
		fontWeight: "bold",
	},
	photoBox: {
		width: 80,
		height: 100,
		border: "1pt solid #000",
		borderColor: "#000",
		textAlign: "center",
		justifyContent: "center",
		marginBottom: 15,
	},
	photoText: {
		fontSize: 8,
		color: "#666",
	},
	mainContent: {
		flexDirection: "row",
		marginBottom: 15,
	},
	leftColumn: {
		flex: 3,
		marginRight: 15,
	},
	rightColumn: {
		flex: 1,
	},
	formInfo: {
		marginTop: "auto",
		paddingTop: 10,
		borderTop: "1pt solid #000",
		borderTopColor: "#000",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	formNo: {
		fontSize: 12,
		fontWeight: "bold",
	},
	date: {
		fontSize: 10,
		color: "#666",
	},
});

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
}

interface CandidateRegistrationPDFProps {
	candidateData: CandidateData;
}

const CandidateRegistrationPDFDocument: React.FC<
	CandidateRegistrationPDFProps
> = ({ candidateData }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
	};

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>
						{candidateData.eventName} – Application Form
					</Text>
					<Text style={styles.subtitle}>
						Please fill in all details in BLOCK letters
					</Text>
				</View>

				{/* Main Content with Photo */}
				<View style={styles.mainContent}>
					{/* Left Column - Form Fields */}
					<View style={styles.leftColumn}>
						{/* Applicant Details */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>
								Applicant Details (to be filled in BLOCK
								letters):
							</Text>

							<View style={styles.row}>
								<View style={styles.field}>
									<Text style={styles.label}>
										First Name:
									</Text>
									<Text style={styles.value}>
										{candidateData.firstName}
									</Text>
								</View>
								<View style={styles.field}>
									<Text style={styles.label}>Last Name:</Text>
									<Text style={styles.value}>
										{candidateData.lastName}
									</Text>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.field}>
									<Text style={styles.label}>
										Date of Birth (DD/MM/YY):
									</Text>
									<Text style={styles.value}>
										{candidateData.dateOfBirth
											? formatDate(
													candidateData.dateOfBirth
											  )
											: ""}
									</Text>
								</View>
								<View style={styles.field}>
									<Text style={styles.label}>Gender:</Text>
									<Text style={styles.value}>
										{candidateData.gender}
									</Text>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.fullWidth}>
									<Text style={styles.label}>Address:</Text>
									<Text style={styles.value}>
										{candidateData.address}
									</Text>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.field}>
									<Text style={styles.label}>
										Educational Level:
									</Text>
									<Text style={styles.value}>
										{candidateData.educationalLevel}
									</Text>
								</View>
								<View style={styles.field}>
									<Text style={styles.label}>
										Height (in feet):
									</Text>
									<Text style={styles.value}>
										{candidateData.height}
									</Text>
								</View>
							</View>
						</View>
					</View>

					{/* Right Column - Photo */}
					<View style={styles.rightColumn}>
						<View style={styles.photoBox}>
							{candidateData.photoUrl ? (
								<Image
									src={candidateData.photoUrl}
									style={{ width: "100%", height: "100%" }}
								/>
							) : (
								<Text style={styles.photoText}>
									PASSPORT{"\n"}SIZE{"\n"}PHOTO
								</Text>
							)}
						</View>
					</View>
				</View>

				{/* Parent's Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Parent's Information:
					</Text>

					<View style={styles.row}>
						<View style={styles.field}>
							<Text style={styles.label}>First Name:</Text>
							<Text style={styles.value}>
								{candidateData.parentFirstName}
							</Text>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Last Name:</Text>
							<Text style={styles.value}>
								{candidateData.parentLastName}
							</Text>
						</View>
					</View>

					<View style={styles.row}>
						<View style={styles.field}>
							<Text style={styles.label}>Occupation:</Text>
							<Text style={styles.value}>
								{candidateData.parentOccupation}
							</Text>
						</View>
						<View style={styles.field}>
							<Text style={styles.label}>Contact No.:</Text>
							<Text style={styles.value}>
								{candidateData.parentContactNo}
							</Text>
						</View>
					</View>
				</View>

				{/* Parent's Declaration */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Parent's Authority Declaration:
					</Text>
					<View style={styles.declarationBox}>
						<Text style={styles.declarationText}>
							I, Mr./Mrs.{" "}
							<Text style={styles.underlinedName}>
								{candidateData.parentFirstName.toUpperCase()}{" "}
								{candidateData.parentLastName.toUpperCase()}
							</Text>{" "}
							(Father/Mother/Guardian of Mr./Miss{" "}
							<Text style={styles.underlinedName}>
								{candidateData.firstName.toUpperCase()}{" "}
								{candidateData.lastName.toUpperCase()}
							</Text>
							), have no objection to his/her participation in{" "}
							{candidateData.eventName}. I will fully co-operate
							and support him/her in this program.
						</Text>
						<View style={styles.checkbox}>
							{candidateData.parentDeclaration && (
								<View style={styles.checkboxSquare}></View>
							)}
							{!candidateData.parentDeclaration && (
								<View
									style={[
										styles.checkboxSquare,
										{ backgroundColor: "#fff" },
									]}
								></View>
							)}
							<Text style={styles.checkboxLabel}>
								I agree to the above declaration
							</Text>
						</View>
					</View>
				</View>

				{/* Signatures */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Signatures:</Text>
					<View style={styles.signatureSection}>
						<View style={styles.signatureBox}>
							<View style={styles.signatureLine}></View>
							<Text style={styles.signatureLabel}>
								Signature of Applicant
							</Text>
						</View>
						<View style={styles.signatureBox}>
							<View style={styles.signatureLine}></View>
							<Text style={styles.signatureLabel}>
								Signature of Parent
							</Text>
						</View>
						<View style={styles.signatureBox}>
							<View style={styles.signatureLine}></View>
							<Text style={styles.signatureLabel}>
								Approved by
							</Text>
						</View>
					</View>
				</View>

				{/* Form Information */}
				<View style={styles.formInfo}>
					<Text style={styles.formNo}>
						Form No: {candidateData.formNo}
					</Text>
					<Text style={styles.date}>
						Date: {formatDate(candidateData.registrationDate)}
					</Text>
				</View>
			</Page>
		</Document>
	);
};

export default CandidateRegistrationPDFDocument;
