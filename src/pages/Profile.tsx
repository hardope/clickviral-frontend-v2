import Loader from '../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import { useEffect, useState } from 'react';
import api from '../api';
import UserNotFound from '../components/UserNotFound';
import profileImage from '../assets/images/profile.svg';
import coverImage from '../assets/images/cover_default.png';

const Profile = () => {

    const [loading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>({});
    const [notFound, setNotFound] = useState(false);

    const navigate = useNavigate();

    const { username } = useParams<{ username: string }>();
    const authUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/user/username/${username}`);
                let userdata = response.data.data;
                if (userdata.profileImage == '') {
                    userdata.profileImage = profileImage;
                }
                if (userdata.coverImage == '') {
                    userdata.coverImage = coverImage;
                }
                setUser(response.data.data);
                setIsLoading(false);
            } catch (error: any) {
                if (error.response.status === 404) {
                    setNotFound(true);
                }
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    // setIsLoading(false);

    const handleMessageClick = () => {
        navigate('/messaging');
    };

    const handleEditProfileClick = () => {
        navigate('/edit-profile');
    }

    return (
        <div>
            {loading && <Loader />}
            {!loading && !notFound && (
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
                    { authUser.id !== user.id ? 
                        <button className="message-button" onClick={handleMessageClick}>
                        Message
                        </button>
                        :
                        <button className="message-button" onClick={handleEditProfileClick}>
                        Edit Profile
                        </button>
                    }
                </div>
            </div>
            )}
                {notFound && <UserNotFound />}
        </div>
    );
};

export default Profile;
