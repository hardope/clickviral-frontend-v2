import React, { useState, useEffect } from 'react';
import '../styles/EditProfile.css';
import DefaultCoverImg from '../assets/images/cover_default.png';
import DefaultProfile from '../assets/images/profile.svg';
import api from '../api';
import Notify from '../utils/Notify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const EditProfile = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [loader, setLoader] = useState(true);

    const navigate = useNavigate();

    // Fetch user data on page load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user/me');
                const { username, profileImage, coverImage, first_name, last_name, bio, id } = response.data.data;
                setProfileImage(profileImage);
                setCoverImage(coverImage);
                setFirstName(first_name);
                setLastName(last_name);
                setBio(bio);
                setId(id);
                setUsername(username);

            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoader(false); // Stop loading when data is fetched
            }
        };

        fetchUserData();
    }, []);

    // Handle profile image change
    const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            setNewProfileImage(file); // Store the new image file
            setProfileImage(URL.createObjectURL(file)); // Preview the new image
        }
    };

    // Handle cover image change
    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            setNewCoverImage(file); // Store the new cover image
            setCoverImage(URL.createObjectURL(file)); // Preview the new image
        }
    };

    // Handle save profile action
    const handleSaveProfile = async () => {
        setLoader(true); // Show loader while saving
        try {
            // Update bio, first name, and last name
            await api.put(`/user/${id}`, {
                first_name: firstName,
                last_name: lastName,
                bio: bio,
            });

            // Upload profile image if a new one was selected
            if (newProfileImage) {
                const profileFormData = new FormData();
                profileFormData.append('file', newProfileImage);
                profileFormData.append('image_type', 'profile');

                const profileResponse = await api.post('/user/upload-image', profileFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Update profile image URL if successfully uploaded
                setProfileImage(profileResponse.data.image_url);
            }

            // Upload cover image if a new one was selected
            if (newCoverImage) {
                const coverFormData = new FormData();
                coverFormData.append('file', newCoverImage);
                coverFormData.append('image_type', 'cover');

                const coverResponse = await api.post('/user/upload-image', coverFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Update cover image URL if successfully uploaded
                setCoverImage(coverResponse.data.image_url);
            }

            Notify('Profile updated successfully', 'success', 'Success');
            navigate(`/profile/${username}`);
        } catch (error: any) {
            Notify(error.response?.data?.message || 'Error updating profile', 'error', 'Error');
        } finally {
            setLoader(false); // Stop loader after saving
        }
    };

    return (
        <div className="edit-profile-container">
            {loader && <Loader />} {/* Show loader while loading data or saving */}

            {/* Profile & Cover Image */}
            <div className="images-section">
                <div className="cover-image">
                    <img
                        src={coverImage || DefaultCoverImg}
                        alt="Cover"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                    />
                    <input
                        id="cover-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleCoverImageChange}
                    />
                </div>
                <div className="profile-image">
                    <img
                        src={profileImage || DefaultProfile}
                        alt="Profile"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                    />
                    <input
                        id="profile-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageChange}
                    />
                </div>
            </div>

            {/* Edit Fields */}
            <div className="edit-fields">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                />
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write your bio..."
                />
            </div>

            {/* Reset Buttons */}
            <div className="reset-buttons">
                <button onClick={() => Notify("This Feature Coming Soon", "Info", "Feature Unavailable")}>Reset Password</button>
                <button onClick={() => Notify("This Feature Coming Soon", "Info", "Feature Unavailable")}>Reset Email</button>
            </div>

            {/* Save Profile Button */}
            <div className="save-profile">
                <button onClick={handleSaveProfile}>Save Profile</button>
            </div>
        </div>
    );
};

export default EditProfile;
