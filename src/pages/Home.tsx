import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Home.css";

const Home = () => {
  const [_userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState([
    {
      "title": "",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit est laborum.",
      "user": {
          "username": "user1",
          "email": "user@mail.com",
          "first_name": "Jeremiah",
          "last_name": "Adeyeri",
          "bio": "Test bio for users",
          "profileImage": "https://backend.click-viral.tech/assets/bfef6e4b-bc5a-4bb1-8e8b-19f48b2f3588.jpeg",
          "coverImage": "",
          "last_seen": "2024-12-31T09:48:42.677Z",
          "is_active": true,
          "is_admin": false,
          "profile_type": "public",
          "date_joined": "2024-08-30T01:26:27.083Z",
          "id": "66d11fc39d31bb377c415b0d"
      },
      "type": "post",
      "created_at": "2024-12-30T17:51:20.833Z",
      "updated_at": "2024-12-30T17:51:20.833Z",
      "id": "6772dd986bfe7b19a817a7c5",
      "isLiked": false,
      "likes": 0,
      "comments": 0
    },
    {
      "title": "",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "user": {
          "username": "hardope",
          "email": "adeyeriopeoluwa05@gmail.com",
          "first_name": "Opeoluwa",
          "last_name": "Adeyeri",
          "bio": "Intern Software Engineer @hubinit",
          "profileImage": "https://backend.click-viral.tech/assets/83ce0a1a-00dd-4f8d-b3fd-6415bafcc839.jpg",
          "coverImage": "https://backend.click-viral.tech/assets/f1ec807b-ae95-4987-8f64-6420eccd70ed.jpg",
          "last_seen": "2024-12-30T18:19:03.736Z",
          "is_active": true,
          "is_admin": false,
          "profile_type": "public",
          "date_joined": "2024-06-27T22:45:16.514Z",
          "id": "667deb7c5bd6c8753bb2ecf0"
      },
      "type": "post",
      "created_at": "2024-12-30T16:44:14.808Z",
      "updated_at": "2024-12-30T16:44:14.808Z",
      "id": "6772cdde7b10e51824abb7fd",
      "isLiked": false,
      "likes": 1,
      "comments": 1
  },
  ]);

  const toggleLike = (id: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
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

    user();
  }, []);

  return (
    <div className="home-page">
      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <img
              src={post.user.profileImage}
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
            <button className="comment-button">💬 {post.comments}</button>
            <button className="share-button">🔗 Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
