import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
	return (
		<div className="notfound-container">
		<div className="notfound-header">
			<img src="icon.png" alt="Icon" className="notfound-icon" />
		</div>
		<div className="notfound-content">
			<h1 className="notfound-title">404</h1>
			<p className="notfound-text">Oops! The page you're looking for doesn't exist.</p>
			<Link to="/" className="notfound-button">
			Go Home
			</Link>
		</div>
		<div className="notfound-bg">
			<div className="notfound-stars"></div>
			<div className="notfound-stars notfound-stars2"></div>
			<div className="notfound-stars notfound-stars3"></div>
		</div>
		</div>
	);
};

export default NotFound;
