import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"
import Layout from "./components/Layout"
import Chat from "./pages/Chat"
import Notifications from "./pages/Notifications"
import EditProfile from "./pages/EditProfile"

function Logout() {
	console.log("Logging out");
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('access_token');
	return <Navigate to="/auth" />;
}

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="*" element={<NotFound />} />
				<Route path="profile/:username" element={<Layout><Profile /></Layout>} />
				<Route path="chats" element={<Layout><Chat /></Layout>} />
				<Route path="notifications" element={<Layout><Notifications /></Layout>} />
				<Route path="profile/edit" element={<ProtectedRoute><Layout><EditProfile /></Layout></ProtectedRoute>} />
			</Routes>
		</Router>
	)
}

export default App
