import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../environment";
import "../styles/loader.css";

interface Props {
	children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		auth().catch(() => setIsAuthenticated(false));
	}, [])

	const refresToken = async () => {
		try {
			const refreshToken = localStorage.getItem(REFRESH_TOKEN);
			const response = await api.post("/user/refresh/", {
				refreshToken: refreshToken,
			});
			if (response.status == 200) {
				const accessToken = response.data.token;
				localStorage.setItem(ACCESS_TOKEN, accessToken);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			setIsAuthenticated(false);
		}
	}

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
			return;
		} else {
			setIsAuthenticated(true);
		}
	}

	if (isAuthenticated != null) return <div className="loader-container"><span id="loader"></span></div>;
	
	if (!isAuthenticated) return <Navigate to="/auth" />;

	return children;
}

export default ProtectedRoute;
 