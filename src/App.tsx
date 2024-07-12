import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"

function Logout() {
	localStorage.clear();
	return <Navigate to="/auth" />;
}

function AuthAndLogout() {
	localStorage.clear();
	return <Auth />;
}

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
				<Route path="/auth" element={<AuthAndLogout />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	)
}

export default App
