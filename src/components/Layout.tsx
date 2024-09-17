import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';
import api from '../api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	// Check local storage for theme preference during the initial render
	const initialTheme = localStorage.getItem('theme') === 'dark';
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(initialTheme);
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const user = () => {
			api.get("/user/me")
				.then((res) => {
					setUserData(res.data.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		user();
	}, []);

	// Function to toggle the sidebar
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Function to toggle dark mode and save the preference to local storage
	const toggleDarkMode = () => {
		const newMode = !isDarkMode;
		setIsDarkMode(newMode);
		localStorage.setItem('theme', newMode ? 'dark' : 'light');
	};

	// Function to toggle search bar
	const toggleSearch = () => setIsSearchActive(!isSearchActive);

	return (
		<div className={`layout ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
		<nav className="navbar">
			<div className="navbar-left">
			<img 
				src="/images/icon.png" 
				alt="App Icon" 
				className="icon app-icon" 
				onClick={() => navigate('/')} 
			/>
			</div>
			<div className={`navbar-center ${isSearchActive ? 'active-search' : ''}`}>
			<div className="nav-icons">
				<img 
				src="/images/home.svg" 
				alt="Home" 
				className="icon nav-icon" 
				onClick={() => navigate('/')} 
				/>
				<img 
				src="/images/chat.svg" 
				alt="Chats" 
				className="icon nav-icon" 
				onClick={() => navigate('/chats')} 
				/>
				<img 
				src="/images/profile.svg" 
				alt="Profile" 
				className="icon nav-icon" 
				onClick={() => navigate(`/profile/${userData?.username}`)} 
				/>
				<img 
				src="/images/notification.svg" 
				alt="Notifications" 
				className="icon nav-icon" 
				onClick={() => navigate('/notifications')} 
				/>
			</div>
			<input 
				type="text" 
				className={`search-bar ${isSearchActive ? 'active' : ''}`} 
				placeholder="Search..."
			/>
			</div>
			<div className="navbar-right">
			<img 
				src="/images/search.svg" 
				alt="Search" 
				className="icon search-icon" 
				onClick={toggleSearch} 
			/>
			<img 
				src="/images/menu.svg" 
				alt="Menu" 
				className="icon menu-icon" 
				onClick={toggleSidebar} 
			/>
			</div>
		</nav>
		<aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
			<div className="sidebar-header" onClick={toggleSidebar}>
			<img 
				src="/images/back.svg" 
				alt="Go Back" 
				className="icon go-back-icon" 
			/>
			<span>Menu</span>
			</div>
			<div className="sidebar-content">
			<div className="sidebar-item" onClick={() => navigate(`/profile/${userData?.username}`)} >
				<img 
				src="/images/profile.svg"
				alt="Account" 
				className="icon" 
				/>
				<span>Account</span>
			</div>
			<div className="sidebar-item" onClick={() => navigate('/privacy')}>
				<img 
				src="/images/lock.svg"
				alt="Privacy" 
				className="icon" 
				/>
				<span>Privacy</span>
			</div>
			<div className="sidebar-item" onClick={() => navigate('/security')}>
				<img 
				src="/images/shield.svg"
				alt="Security" 
				className="icon" 
				/>
				<span>Security</span>
			</div>
			<div className="sidebar-item" onClick={toggleDarkMode}>
				<div className="mode-toggle">
				<img
					src={isDarkMode ? '/images/light_mode.svg' : '/images/dark_mode.svg'}
					alt="Mode Toggle"
					className="icon"
				/>
				</div>
				<span>Dark/Light Mode</span>
			</div>
			<div className="sidebar-item" onClick={() => navigate('/logout')}>
				<img 
				src="/images/power.svg"
				alt="Logout" 
				className="icon" 
				/>
				<span>Logout</span>
			</div>
			</div>
		</aside>
		<main className="content">{children}</main>
		{/* Bottom navigation for mobile */}
		<div className="bottom-nav">
			<div className="bottom-nav-center">
			<img 
				src="/images/home.svg"
				alt="Home" 
				className="icon nav-icon"
				onClick={() => navigate('/')} 
			/>
			<img 
				src="/images/chat.svg"
				alt="Chats" 
				className="icon nav-icon"
				onClick={() => navigate('/chats')} 
			/>
			<img 
				src="/images/profile.svg"
				alt="Profile" 
				className="icon nav-icon"
				onClick={() => navigate(`/profile/${userData?.username}`)} 
			/>
			<img 
				src="/images/notification.svg" 
				alt="Notifications" 
				className="icon nav-icon" 
				onClick={() => navigate('/notifications')} 
			/>
			</div>
		</div>
		</div>
	);
};

export default Layout;
