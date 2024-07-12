import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../environment";
import "../styles/Loader.css";

interface Props {
	children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true); // New loading state

	useEffect(() => {
		auth().then(() => setIsLoading(false)); // Handle loading after auth
	}, []);

	const refresToken = async () => {
		try {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN);
			const response = await api.post("/user/refresh/", { refreshToken });
			if (response.status === 200) {
				const accessToken = response.data.token;
				localStorage.setItem(ACCESS_TOKEN, accessToken);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			setIsAuthenticated(false);
		}
	};

	const auth = async () => {
		const accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (!accessToken) {
			setIsAuthenticated(false);
			return;
		}

		const exp = jwtDecode(accessToken).exp || 0;
		const now = Date.now() / 1000;
		if (exp - now < 60) {
			await refresToken();
		} else {
			setIsAuthenticated(true);
		}
	};

	if (isLoading) return <div className="loader-container"><span className="loader"></span></div>; // Show loader while authenticating

	if (!isAuthenticated) return <Navigate to="/logout" replace />; // Use replace to avoid history buildup

	return children;
}

export default ProtectedRoute;
