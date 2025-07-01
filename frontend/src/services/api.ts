import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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

export default api;
