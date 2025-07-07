import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, EMAIL_RECIPIENTS } from "../config/emailjs";

interface FormData {
	name: string;
	email: string;
	queryType: string;
	message: string;
}

function Contact() {
	const form = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		queryType: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

	// Get email configuration based on query type
	const getEmailConfig = (queryType: string) => {
		return (
			EMAIL_RECIPIENTS[queryType as keyof typeof EMAIL_RECIPIENTS] ||
			EMAIL_RECIPIENTS.entertainment
		);
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.name ||
			!formData.email ||
			!formData.queryType ||
			!formData.message
		) {
			alert("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			const emailConfig = getEmailConfig(formData.queryType);

			// EmailJS template parameters
			const templateParams = {
				from_name: formData.name,
				from_email: formData.email,
				to_email: emailConfig.email,
				to_name: emailConfig.name,
				query_type: formData.queryType,
				message: formData.message,
				reply_to: formData.email,
			};

			await emailjs.send(
				EMAILJS_CONFIG.SERVICE_ID,
				EMAILJS_CONFIG.TEMPLATE_ID,
				templateParams,
				EMAILJS_CONFIG.PUBLIC_KEY
			);

			setSubmitStatus("success");
			setFormData({
				name: "",
				email: "",
				queryType: "",
				message: "",
			});
		} catch (error) {
			console.error("Email sending failed:", error);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<div className="min-h-screen bg-gray-900 py-20">
			<div className="max-w-4xl mx-auto px-8">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-bold text-white mb-4">
						Get In{" "}
						<span className="text-yellow-400 font-bold">Touch</span>
					</h1>{" "}
					<p className="text-xl text-gray-300">
						Ready to create your next spectacular event or join our
						arts school? Let's bring your vision to life with
						Sankalp Event and Entertainment.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Contact Form */}
					<div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
						<h2 className="text-2xl font-bold text-yellow-400 mb-6">
							Send us a message
						</h2>

						{submitStatus === "success" && (
							<div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
								✅ Message sent successfully! We'll get back to
								you soon.
							</div>
						)}

						{submitStatus === "error" && (
							<div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
								❌ Failed to send message. Please try again or
								contact us directly.
							</div>
						)}

						<form
							ref={form}
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<div>
								<label className="block text-gray-300 mb-2">
									Name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
									placeholder="Your Name"
									required
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Email *
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
									placeholder="your.email@example.com"
									required
								/>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Query Type *
								</label>
								<select
									name="queryType"
									value={formData.queryType}
									onChange={handleInputChange}
									className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
									required
								>
									<option value="">Select Query Type</option>
									<option value="entertainment">
										Event Management & Entertainment
									</option>
									<option value="school">
										School of Art and Skills
									</option>
									<option value="magazine">
										Aamar Xopun Magazine
									</option>
								</select>
							</div>
							<div>
								<label className="block text-gray-300 mb-2">
									Message *
								</label>
								<textarea
									name="message"
									value={formData.message}
									onChange={handleInputChange}
									rows={5}
									className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
									placeholder="Tell us about your requirements..."
									required
								/>
							</div>
							<button
								type="submit"
								disabled={isSubmitting}
								className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
									isSubmitting
										? "bg-gray-600 cursor-not-allowed"
										: "bg-gradient-to-r from-yellow-400 to-red-500 hover:opacity-90"
								} text-white`}
							>
								{isSubmitting ? "Sending..." : "Send Message"}
							</button>
						</form>

						{/* Email Addresses Section */}
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl mt-8">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								📧 Email Addresses
							</h3>
							<div className="space-y-3 text-gray-300">
								<div>
									<p className="font-semibold text-yellow-300">
										Event Management:
									</p>
									<a
										href="mailto:sankalpentertainment360@gmail.com"
										className="hover:text-yellow-400 transition-colors text-sm"
									>
										sankalpentertainment360@gmail.com
									</a>
								</div>
								<div>
									<p className="font-semibold text-yellow-300">
										School Admissions:
									</p>
									<a
										href="mailto:sankalpschool.art@gmail.com"
										className="hover:text-yellow-400 transition-colors text-sm"
									>
										sankalpschool.art@gmail.com
									</a>
								</div>
								<div>
									<p className="font-semibold text-yellow-300">
										Magazine:
									</p>
									<a
										href="mailto:aamarxopun.magazine@gmail.com"
										className="hover:text-yellow-400 transition-colors text-sm"
									>
										aamarxopun.magazine@gmail.com
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Info */}
					<div className="space-y-8">
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🏢 Company
							</h3>
							<p className="text-gray-300">
								Sankalp Entertainment
								<br />
								Leading Event Management Company
								<br />
								Assam, Northeast India
							</p>
						</div>{" "}
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🏫 Arts School
							</h3>
							<p className="text-gray-300 mb-3">
								Sankalp School of Art and Skills
								<br />
								"Confidence Starts Here"
							</p>
							<div className="text-sm text-gray-400">
								<p>📍 Bapujinagar, Carbon Gate</p>
								<p>📍 LKRB Road, Nabinnagar</p>
							</div>
						</div>
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								🌐 Follow Us
							</h3>
							<div className="space-y-4">
								<div>
									<p className="font-semibold text-yellow-300 mb-2">
										Sankalp School of Art & Skills:
									</p>
									<a
										href="https://www.instagram.com/sankalp_school/?igsh=MXRhc3owN2IwMjB2Mw%3D%3D#"
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
									>
										📷 Instagram @sankalp_school
									</a>
								</div>
								<div>
									<p className="font-semibold text-yellow-300 mb-2">
										Sankalp Event & Entertainment:
									</p>
									<a
										href="https://www.instagram.com/sankalp_event/?igsh=dmU2N29mNmNtazV4#"
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
									>
										📷 Instagram @sankalp_event
									</a>
								</div>
								<div>
									<p className="font-semibold text-yellow-300 mb-2">
										Aamar Xopun Magazine:
									</p>
									<a
										href="https://www.facebook.com/people/%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A7%B0-%E0%A6%B8%E0%A6%AA%E0%A7%8B%E0%A6%A8/100070507135885/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
									>
										📘 Facebook Page
									</a>
								</div>
								<div className="text-sm text-gray-400 pt-2 border-t border-gray-600">
									Follow for latest events, training updates,
									and magazine releases
								</div>
							</div>
						</div>{" "}
						<div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
							<h3 className="text-xl font-bold text-yellow-400 mb-4">
								💼 Services
							</h3>
							<ul className="text-gray-300 text-sm space-y-1">
								<li>• Traditional Runway Shows</li>
								<li>• Fashion Show Production</li>
								<li>• Cultural Event Management</li>
								<li>• Arts & Skills Training</li>
								<li>• Event Planning & Management</li>
								<li>• Photography & Modelling Training</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contact;
