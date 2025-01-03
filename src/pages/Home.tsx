import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Home.css";
import profileSvg from '/images/profile.svg';
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Notify from "../utils/Notify";

const Home = () => {
	const [userData, setUserData] = useState<any>(null);
	const [posts, setPosts] = useState<any>([])
	const navigate = useNavigate();

	const toggleLike = (id: string) => {
		const updatedPosts = posts.map((post: any) => {
		if (post.id === id) {
			if (post.isLiked) {
				api.post(`/posts/unlike/${id}`).catch((err) => {
					console.log(err);
					Notify("An error occurred while unliking the comment", "error", "Error");
				});
			} else {
				api.post(`/posts/like/${id}`).catch((err) => {
					console.log(err);
					Notify("An error occurred while liking the comment", "error", "Error");
				});
			}
			return {
				...post,
				isLiked: !post.isLiked,
				likes: post.isLiked ? post.likes - 1 : post.likes + 1,
			};
		}
			return post;
		});
		setPosts(updatedPosts);
	};

	const formatTime = (isoTime: string) => {
		const diff = (new Date().getTime() - new Date(isoTime).getTime()) / 1000;
		if (diff < 60) return `${Math.floor(diff)} seconds ago`;
		if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
		return new Date(isoTime).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	useEffect(() => {
		const user = () => {
			api
				.get("/user/me")
				.then((res) => {
				setUserData(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
		};

		const fetchPosts = () => {
			api
				.get("/posts")
				.then((res) => {
				setPosts(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
		}

		user();
		fetchPosts();
	}, []);

	return (
		<div className="home-page">
		{/* <button className="open-create-post-button"><span style={{ fontSize: "24px" }}>+</span></button> */}
		{userData ? (
		<>
			<div className="create-post" onClick={() => navigate("/createPost")}>
			<div className="create-post-container">
			<div className="create-post">
			<div className="create-post-header">
				<img src={userData.profileImage || profileSvg} alt="Profile Picture" className="profile-picture" />
				<input className="create-post-input" placeholder="What's on your mind?" disabled />
			</div>
			<div className="create-post-actions">
				<button className="post-action-button photo-upload"><img src="/images/picture.svg" className="icon" alt="Upload" /></button>
				<button className="post-action-button capture-image"><img src="/images/camera.svg" className="icon" alt="Capture" /></button>
			</div>
			</div>
			</div>
			</div>
		
			{posts.length > 0 ? (
			posts.map((post: any) => (
				<div className="post-card" key={post.id}>
				<div className="post-header">
			<img
				src={post.user.profileImage || profileSvg}
				alt={`${post.user.first_name}'s profile`}
				className="profile-pic"
			/>
			<div className="user-info">
				<strong>{post.user.first_name} {post.user.last_name}</strong>
				<span className="timestamp">{formatTime(post.created_at)}</span>
			</div>
				</div>
				{post.content && <p className="post-content">{post.content}</p>}
				<div className="separator"></div>
				<div className="post-actions">
			<button
				className={`like-button ${post.isLiked ? "liked" : ""}`}
				onClick={() => toggleLike(post.id)}
			>
				{post.isLiked ? "❤️" : "🖤"} {post.likes}
			</button>
			<button className="comment-button" onClick={() => navigate(
				`/comments/${post.id}`
			)}>💬 {post.comments}</button>
			<button className="share-button">🔗 Share</button>
				</div>
				</div>
			))
			) : (
				<Loader></Loader>
			)}
		</>
		) : (
		<Loader />
		)}
		</div>
	);
};

export default Home;
