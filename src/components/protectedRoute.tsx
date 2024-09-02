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
	const [checkedAuth, setCheckedAuth] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // New loading state

	useEffect(() => {
		auth().then(() => setIsLoading(false)); // Handle loading after auth
	}, []);

	const refreshToken = async () => {
		try {
			console.log("Attempting to rereesh token")
			const refreshToken = localStorage.getItem(REFRESH_TOKEN);
			console.log("Refresh token: ", refreshToken);
			const response = await api.post("/user/refresh/", { refreshToken });
			if (response.status === 200) {

				const accessToken = response.data.token;

				console.log('Acess token ' + accessToken);
				localStorage.setItem(ACCESS_TOKEN, accessToken);
				console.log("Access token refreshed");
				setIsAuthenticated(true);
			} else {
				// console.log(response.data);
				setIsAuthenticated(false);
			}	
		} catch (error) {
			setIsAuthenticated(false);
		}
	};

	const auth = async () => {
		// console.log("Authenticating")
		const accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (!accessToken) {
			setIsAuthenticated(false);
			setCheckedAuth(true);
			return;
		}

		try {
			var exp = jwtDecode(accessToken).exp || 0;
			// console.log("Access token expires at: ", new Date(exp * 1000));
		} catch (error) {
			// console.log(error);
			setIsAuthenticated(false);
			setCheckedAuth(true);
			return;
		}
		const now = Math.floor(Date.now() / 1000); // Convert to seconds
		// console.log("Current time: ", now);

		// console.log(`Access token expires in ${exp - now} seconds`);

		// Check if token expires within the next hour (3600 seconds)
		if (exp - now < 3600) {
			// console.log("Token expired or will expire soon");
			await refreshToken();
		} else {
			setIsAuthenticated(true);
		}

	};

	if (isLoading) return <div className="loader-container"><span className="loader"></span></div>; // Show loader while authenticating

	if (!isAuthenticated && checkedAuth) return <Navigate to="/logout" replace />; // Use replace to avoid history buildup

	return children;
}

export default ProtectedRoute;
