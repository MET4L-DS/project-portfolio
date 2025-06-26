import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
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

export default api;
