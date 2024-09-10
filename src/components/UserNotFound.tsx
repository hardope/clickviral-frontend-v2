// import React from 'react';
import '../styles/UserNotFound.css';

const UserNotFound = () => {

  return (
    <div className="user-not-found-container">
      <div className="user-not-found-content">
        <h1>User Not Found</h1>
        <p>We couldn’t find the user you’re looking for.</p>
        <div className="not-found-icon">
          {/* Add an SVG or icon here, for example */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#04befe"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserNotFound;
