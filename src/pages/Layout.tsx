import React, { useState } from 'react';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSearch = () => setIsSearchActive(!isSearchActive);

  return (
    <div className={`layout ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/icon.png" alt="App Icon" className="icon app-icon" />
        </div>
        <div className={`navbar-center ${isSearchActive ? 'active-search' : ''}`}>
          <div className="nav-icons">
            <img src="/images/home.svg" alt="Home" className="icon nav-icon" />
            <img src="/images/chat.svg" alt="Chats" className="icon nav-icon" />
            <img src="/images/profile.svg" alt="Profile" className="icon nav-icon" />
            <img src="/images/notification.svg" alt="Notifications" className="icon nav-icon" />
          </div>
          <input type="text" className={`search-bar ${isSearchActive ? 'active' : ''}`} placeholder="Search..." />
        </div>
        <div className="navbar-right">
          <div className="mode-toggle" onClick={toggleDarkMode}>
            <img
              src={isDarkMode ? '/images/light_mode.svg' : '/images/dark_mode.svg'}
              alt="Mode Toggle"
              className="icon"
            />
          </div>
          <img src="/images/search.svg" alt="Search" className="icon search-icon" onClick={toggleSearch} />
          <img src="/images/menu.svg" alt="Menu" className="icon menu-icon" onClick={toggleSidebar} />
        </div>
      </nav>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/images/back.svg" alt="Go Back" className="icon go-back-icon" onClick={toggleSidebar} />
          <span>Menu</span>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-item">
            <img src="/images/profile.svg" alt="Account" className="icon" />
            <span>Account</span>
          </div>
          <div className="sidebar-item">
            <img src="/images/lock.svg" alt="Privacy" className="icon" />
            <span>Privacy</span>
          </div>
          <div className="sidebar-item">
            <img src="/images/shield.svg" alt="Security" className="icon" />
            <span>Security</span>
          </div>
          <div className="sidebar-item">
            <img src="/images/power.svg" alt="Logout" className="icon" />
            <span>Logout</span>
          </div>
        </div>
      </aside>
      <main className="content">{children}</main>
      {/* Bottom navigation for mobile */}
      <div className="bottom-nav">
        <div className="bottom-nav-center">
          <img src="/images/home.svg" alt="Home" className="icon nav-icon" />
          <img src="/images/chat.svg" alt="Chats" className="icon nav-icon" />
          <img src="/images/profile.svg" alt="Profile" className="icon nav-icon" />
          <img src="/images/notification.svg" alt="Notifications" className="icon nav-icon" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
