import axios from "axios";

// Get API base URL from environment variable or default to localhost
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 60000, // Increased to 60 seconds for file uploads
});

// Add auth token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			// Redirect to login if needed
			if (window.location.pathname.startsWith("/admin")) {
				window.location.href = "/admin/login";
			}
		}
		return Promise.reject(error);
	}
);

// Auth API
export const authAPI = {
	login: async (credentials: { username: string; password: string }) => {
		const response = await api.post("/auth/login", credentials);
		return response.data;
	},

	register: async (userData: {
		username: string;
		email: string;
		password: string;
	}) => {
		const response = await api.post("/auth/register", userData);
		return response.data;
	},

	getProfile: async () => {
		const response = await api.get("/auth/me");
		return response.data;
	},

	logout: async () => {
		const response = await api.post("/auth/logout");
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		return response.data;
	},
};

// Events API
export const eventsAPI = {
	// Public endpoints
	getEvents: async (params?: {
		category?: string;
		importance?: string;
		page?: number;
		limit?: number;
	}) => {
		const response = await api.get("/events", { params });
		return response.data;
	},

	getEvent: async (id: string) => {
		const response = await api.get(`/events/${id}`);
		return response.data;
	},

	getCategories: async () => {
		const response = await api.get("/events/meta/categories");
		return response.data;
	},

	// Admin endpoints
	getAdminEvents: async (params?: {
		category?: string;
		importance?: string;
		page?: number;
		limit?: number;
	}) => {
		const response = await api.get("/events/admin/all", { params });
		return response.data;
	},

	createEvent: async (formData: FormData) => {
		const response = await api.post("/events", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	updateEvent: async (id: string, formData: FormData) => {
		const response = await api.put(`/events/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteEvent: async (id: string) => {
		const response = await api.delete(`/events/${id}`);
		return response.data;
	},
};

// Magazine API
export const magazineAPI = {
	// Public endpoints
	getMagazines: async (params?: {
		year?: number;
		month?: string;
		page?: number;
		limit?: number;
		search?: string;
	}) => {
		const response = await api.get("/magazines", { params });
		return response.data;
	},

	getMagazinesByYear: async () => {
		const response = await api.get("/magazines/by-year");
		return response.data;
	},

	getMagazine: async (id: string) => {
		const response = await api.get(`/magazines/${id}`);
		return response.data;
	},

	trackView: async (id: string) => {
		const response = await api.post(`/magazines/${id}/view`);
		return response.data;
	},

	trackDownload: async (id: string) => {
		const response = await api.post(`/magazines/${id}/download`);
		return response.data;
	},

	// Admin endpoints
	getAdminMagazines: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		year?: number;
		isActive?: boolean;
	}) => {
		const response = await api.get("/magazines/admin/all", { params });
		return response.data;
	},

	createMagazine: async (formData: FormData) => {
		const response = await api.post("/magazines", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	updateMagazine: async (id: string, formData: FormData) => {
		const response = await api.put(`/magazines/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteMagazine: async (id: string) => {
		const response = await api.delete(`/magazines/${id}`);
		return response.data;
	},

	toggleActive: async (id: string) => {
		const response = await api.patch(`/magazines/${id}/toggle-active`);
		return response.data;
	},
};

// Student API
export const studentAPI = {
	// Public endpoints
	registerStudent: async (formData: FormData) => {
		const response = await api.post("/students/register", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	getRegistrationStatus: async (formNo: string) => {
		const response = await api.get(`/students/status/${formNo}`);
		return response.data;
	},

	getByFormNo: async (formNo: string) => {
		const response = await api.get(`/students/details/${formNo}`);
		return response.data;
	},

	// Admin endpoints
	getAllRegistrations: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		status?: string;
		course?: string;
		sortBy?: string;
		sortOrder?: string;
	}) => {
		const response = await api.get("/students/admin/all", { params });
		return response.data;
	},

	getRegistration: async (id: string) => {
		const response = await api.get(`/students/admin/${id}`);
		return response.data;
	},

	updateRegistrationStatus: async (
		id: string,
		data: { status: string; notes?: string }
	) => {
		const response = await api.patch(`/students/admin/${id}/status`, data);
		return response.data;
	},

	deleteRegistration: async (id: string) => {
		const response = await api.delete(`/students/admin/${id}`);
		return response.data;
	},

	getStatistics: async () => {
		const response = await api.get("/students/admin/stats/overview");
		return response.data;
	},
};

// Candidates API
export const candidatesAPI = {
	// Public endpoints
	registerCandidate: async (formData: FormData) => {
		const response = await api.post("/candidates", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	getCandidateByFormNo: async (formNo: string) => {
		const response = await api.get(`/candidates/form/${formNo}`);
		return response.data;
	},

	// Admin endpoints
	getAllCandidates: async (params?: {
		eventId?: string;
		status?: string;
		page?: number;
		limit?: number;
	}) => {
		const response = await api.get("/candidates", { params });
		return response.data;
	},

	getCandidate: async (id: string) => {
		const response = await api.get(`/candidates/${id}`);
		return response.data;
	},

	updateCandidateStatus: async (
		id: string,
		data: { status: string; notes?: string }
	) => {
		const response = await api.patch(`/candidates/${id}`, data);
		return response.data;
	},

	deleteCandidate: async (id: string) => {
		const response = await api.delete(`/candidates/${id}`);
		return response.data;
	},
};

// Locations API
export const locationsAPI = {
	// Public endpoints
	getAllLocations: async () => {
		const response = await api.get("/locations");
		return response.data;
	},

	getLocation: async (id: string) => {
		const response = await api.get(`/locations/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllLocationsAdmin: async () => {
		const response = await api.get("/locations/admin");
		return response.data;
	},

	createLocation: async (locationData: {
		name: string;
		address: string;
		icon?: string;
		displayOrder?: number;
	}) => {
		const response = await api.post("/locations", locationData);
		return response.data;
	},

	updateLocation: async (
		id: string,
		locationData: {
			name?: string;
			address?: string;
			icon?: string;
			displayOrder?: number;
			isActive?: boolean;
		}
	) => {
		const response = await api.put(`/locations/${id}`, locationData);
		return response.data;
	},

	deleteLocation: async (id: string) => {
		const response = await api.delete(`/locations/${id}`);
		return response.data;
	},

	toggleLocationStatus: async (id: string) => {
		const response = await api.post(`/locations/${id}/toggle`);
		return response.data;
	},
};

// Skills API
export const skillsAPI = {
	// Public endpoints
	getAllSkills: async () => {
		const response = await api.get("/skills");
		return response.data;
	},

	getSkill: async (id: string) => {
		const response = await api.get(`/skills/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllSkillsAdmin: async () => {
		const response = await api.get("/skills/admin");
		return response.data;
	},

	createSkill: async (skillData: {
		name: string;
		icon: string;
		description?: string;
		displayOrder?: number;
	}) => {
		const response = await api.post("/skills", skillData);
		return response.data;
	},

	updateSkill: async (
		id: string,
		skillData: {
			name?: string;
			icon?: string;
			description?: string;
			displayOrder?: number;
			isActive?: boolean;
		}
	) => {
		const response = await api.put(`/skills/${id}`, skillData);
		return response.data;
	},

	deleteSkill: async (id: string) => {
		const response = await api.delete(`/skills/${id}`);
		return response.data;
	},

	toggleSkillStatus: async (id: string) => {
		const response = await api.post(`/skills/${id}/toggle`);
		return response.data;
	},
};

// Journey API
export const journeyAPI = {
	// Public endpoints
	getAllJourneyItems: async () => {
		const response = await api.get("/journey");
		return response.data;
	},

	getJourneyItem: async (id: string) => {
		const response = await api.get(`/journey/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllJourneyItemsAdmin: async () => {
		const response = await api.get("/journey/admin");
		return response.data;
	},

	createJourneyItem: async (journeyData: {
		year: string;
		title: string;
		description: string;
		logo?: string;
		logoAlt?: string;
		logoDescription?: string;
		displayOrder?: number;
	}) => {
		const response = await api.post("/journey", journeyData);
		return response.data;
	},

	updateJourneyItem: async (
		id: string,
		journeyData: {
			year?: string;
			title?: string;
			description?: string;
			logo?: string;
			logoAlt?: string;
			logoDescription?: string;
			displayOrder?: number;
			isActive?: boolean;
		}
	) => {
		const response = await api.put(`/journey/${id}`, journeyData);
		return response.data;
	},

	deleteJourneyItem: async (id: string) => {
		const response = await api.delete(`/journey/${id}`);
		return response.data;
	},

	toggleJourneyItemStatus: async (id: string) => {
		const response = await api.post(`/journey/${id}/toggle`);
		return response.data;
	},
};

// Achievements API
export const achievementsAPI = {
	// Public endpoints
	getAllAchievements: async () => {
		const response = await api.get("/achievements");
		return response.data;
	},

	getAchievement: async (id: string) => {
		const response = await api.get(`/achievements/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllAchievementsAdmin: async () => {
		const response = await api.get("/achievements/admin");
		return response.data;
	},

	createAchievement: async (achievementData: {
		title: string;
		icon: string;
		category: string;
		items?: Array<{
			name: string;
			description?: string;
			displayOrder?: number;
		}>;
		displayOrder?: number;
	}) => {
		const response = await api.post("/achievements", achievementData);
		return response.data;
	},

	updateAchievement: async (
		id: string,
		achievementData: {
			title?: string;
			icon?: string;
			category?: string;
			items?: Array<{
				name: string;
				description?: string;
				displayOrder?: number;
			}>;
			displayOrder?: number;
			isActive?: boolean;
		}
	) => {
		const response = await api.put(`/achievements/${id}`, achievementData);
		return response.data;
	},

	deleteAchievement: async (id: string) => {
		const response = await api.delete(`/achievements/${id}`);
		return response.data;
	},

	toggleAchievementStatus: async (id: string) => {
		const response = await api.post(`/achievements/${id}/toggle`);
		return response.data;
	},
};

// Services API
export const servicesAPI = {
	// Public endpoints
	getAllServices: async (category?: string) => {
		const params = category ? { category } : {};
		const response = await api.get("/services", { params });
		return response.data;
	},

	getService: async (id: string) => {
		const response = await api.get(`/services/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllServicesAdmin: async (category?: string) => {
		const params = category ? { category } : {};
		const response = await api.get("/services/admin/all", { params });
		return response.data;
	},

	createService: async (serviceData: {
		title: string;
		icon: string;
		description?: string;
		items?: Array<{
			name: string;
			description?: string;
			displayOrder?: number;
		}>;
		category: string;
		displayOrder?: number;
	}) => {
		const response = await api.post("/services", serviceData);
		return response.data;
	},

	updateService: async (
		id: string,
		serviceData: {
			title?: string;
			icon?: string;
			description?: string;
			items?: Array<{
				name: string;
				description?: string;
				displayOrder?: number;
			}>;
			category?: string;
			displayOrder?: number;
			isActive?: boolean;
		}
	) => {
		const response = await api.put(`/services/${id}`, serviceData);
		return response.data;
	},

	deleteService: async (id: string) => {
		const response = await api.delete(`/services/${id}`);
		return response.data;
	},

	toggleServiceStatus: async (id: string) => {
		const response = await api.post(`/services/${id}/toggle`);
		return response.data;
	},
};

// Gallery API
export const galleryAPI = {
	// Public endpoints
	getAllGalleryImages: async (category?: string) => {
		const params = category ? { category } : {};
		const response = await api.get("/gallery", { params });
		return response.data;
	},

	getGalleryImage: async (id: string) => {
		const response = await api.get(`/gallery/${id}`);
		return response.data;
	},

	// Admin endpoints
	getAllGalleryImagesAdmin: async (category?: string) => {
		const params = category ? { category } : {};
		const response = await api.get("/gallery/admin/all", { params });
		return response.data;
	},

	createGalleryImage: async (imageData: FormData) => {
		const response = await api.post("/gallery", imageData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	updateGalleryImage: async (id: string, imageData: FormData) => {
		const response = await api.put(`/gallery/${id}`, imageData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteGalleryImage: async (id: string) => {
		const response = await api.delete(`/gallery/${id}`);
		return response.data;
	},

	toggleGalleryImageStatus: async (id: string) => {
		const response = await api.post(`/gallery/${id}/toggle`);
		return response.data;
	},
};

export default api;
