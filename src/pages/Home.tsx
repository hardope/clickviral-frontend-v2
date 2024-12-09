import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Home.css";

const Home = () => {
  const [_userData, setUserData] = useState<any>(null);
  const posts = [
    {
      id: 1,
      user: "John Doe",
      profilePic: "https://via.placeholder.com/50", // Profile picture
      content: "Exploring the mountains 🌄",
      media: "https://via.placeholder.com/600x300",
      type: "image",
      likes: 34,
      comments: 12,
      timestamp: "2024-12-08T10:00:00Z", // ISO format for easier parsing
    },
    {
      id: 2,
      user: "Jane Smith",
      profilePic: "https://via.placeholder.com/50",
      content: "",
      media: "https://via.placeholder.com/600x300",
      type: "video",
      likes: 102,
      comments: 48,
      timestamp: "2024-12-07T09:00:00Z",
    },
    {
      id: 3,
      user: "Nobody",
      profilePic: "https://via.placeholder.com/50",
      content:
        "A lot of posts to check out in lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio nec odio.",
      media: "",
      type: "",
      likes: 102,
      comments: 48,
      timestamp: "2024-12-07T08:45:00Z",
    },
    {
      id: 4,
      user: "No One for real",
      profilePic: "https://via.placeholder.com/50",
      content:
        "A lot of posts to check out in lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio nec odio. A lot of posts to check out in lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio nec odio.",
      media: "https://via.placeholder.com/600x300",
      type: "",
      likes: 102,
      comments: 48,
      timestamp: "2024-12-10T08:45:00Z",
    },
  ];

  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (id: any) => {
    setLikedPosts((prev: any) =>
      prev.includes(id) ? prev.filter((postId: any) => postId !== id) : [...prev, id]
    );
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

    user();
  }, []);

  return (
    <div className="home-page">
      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <img
              src={post.profilePic}
              alt={`${post.user}'s profile`}
              className="profile-pic"
            />
            <div className="user-info">
              <strong>{post.user}</strong>
              <span className="timestamp">{formatTime(post.timestamp)}</span>
            </div>
          </div>
          {post.content && <p className="post-content">{post.content}</p>}
          {post.media && (
            <>
              <div className="separator"></div>
              {post.type === "image" ? (
                <img src={post.media} alt="Post media" className="post-media" />
              ) : (
                <video src={post.media} controls className="post-media"></video>
              )}
            </>
          )}
          <div className="separator"></div>
          <div className="post-actions">
            <button
              className={`like-button ${likedPosts.includes(post.id) ? "liked" : ""}`}
              onClick={() => toggleLike(post.id)}
            >
              {likedPosts.includes(post.id) ? "❤️" : "🖤"} {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
            </button>
            <button className="comment-button">💬 {post.comments}</button>
            <button className="share-button">🔗 Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
