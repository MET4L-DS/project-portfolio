import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	login: (credentials: {
		username: string;
		password: string;
	}) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			const token = localStorage.getItem("authToken");
			if (token) {
				try {
					const response = await authAPI.getProfile();
					setUser(response.user);
				} catch (error) {
					localStorage.removeItem("authToken");
					localStorage.removeItem("user");
				}
			}
			setIsLoading(false);
		};

		initializeAuth();
	}, []);

	const login = async (credentials: {
		username: string;
		password: string;
	}) => {
		try {
			const response = await authAPI.login(credentials);
			localStorage.setItem("authToken", response.token);
			localStorage.setItem("user", JSON.stringify(response.user));
			setUser(response.user);
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		setUser(null);
	};

	const value = {
		user,
		login,
		logout,
		isAuthenticated: !!user,
		isLoading,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
