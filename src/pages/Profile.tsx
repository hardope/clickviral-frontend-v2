// src/components/Profile.tsx
// import React from 'react';
import Loader from '../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import { useEffect, useState } from 'react';
import api from '../api';

const Profile = () => {

    const [loading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>({});

    const navigate = useNavigate();

    const { username } = useParams<{ username: string }>();

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/user/username/${username}`);
                console.log('User data: ', response.data.data);
                setUser(response.data.data);
                console.log('User: ', user);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data: ', error);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    // setIsLoading(false);

    const handleMessageClick = () => {
        navigate('/messaging');
    };

    return (
        <div>
            {loading && <Loader />}
            {!loading && (
                <div className="profile-page">
                
                <div className="cover-image">
                    <img src={user.coverImage} alt="Cover" />
                </div>
                <div className="profile-details">
                    <div className="profile-image">
                    <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                    </div>
                    <h1 className="profile-name">{`${user.first_name} ${user.last_name}`}</h1>
                    <p className="username">@{user.username}</p>
                    <p className="bio">{user.bio}</p>
                    <button className="message-button" onClick={handleMessageClick}>
                    Message
                    </button>
                </div>
            </div>
            )}
        </div>
    );
};

export default Profile;
