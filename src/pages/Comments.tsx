import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Comments.css";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../utils/Notify";

const Comments = () => {
    const [post, setPost] = useState<any>();
    const [comments, setComments] = useState<any>(null);
    const [newComment, setNewComment] = useState<string>("");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    const toggleLike = (id: string) => {
        const updatedPosts = comments.map((comment: any) => {
            if (comment.id === id) {
                if (comment.isLiked) {
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
                    ...comment,
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                };
            }
            return comment;
        });
        setComments(updatedPosts);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        e.target.style.height = "auto"; // Reset height
        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content height
    };

    const handleNewComment = () => {
        if (!newComment.trim()) return;

        // Simulate adding a new comment locally

        // Send the new comment to the server
        api.post("posts/create", {
            parent_post_id: id,
            content: newComment,
            type: "comment",
        })
        .then((res) => {console.log(res)
            Notify("Comment posted successfully", "success", "Success");
            setComments([
                ...comments,
                {
                    id: res.data.post.id,
                    user: { first_name: loggedInUser.first_name, last_name: loggedInUser.last_name, profileImage: loggedInUser.profileImage },
                    content: newComment,
                    created_at: res.data.post.created_at,
                    isLiked: false,
                    comments: 0,
                    likes: 0,
                },
            ]);
            setNewComment(""); // Clear input
        })
        .catch((err) => {
            console.log(err);
            Notify("An error occurred while posting the comment", "error", "Error");
        });
    };

    useEffect(() => {
        const fetchPosts = () => {
            api
                .get(`posts/comments/${id}`)
                .then((res) => {
                    setComments(res.data.comments);
                    setPost(res.data.post);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchPosts();
    }, [id]);

    return (
        <div className="comments-page">
            <div className="post-section">
                {post && (
                    <div className="post-card">
                        <div className="post-header">
                            <img
                                src={post.user.profileImage}
                                alt={`${post.user.first_name}'s profile`}
                                className="profile-pic"
                            />
                            <div className="user-info">
                                <strong>
                                    {post.user.first_name} {post.user.last_name}
                                </strong>
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
                )}
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                <div className="new-comment">
                    <textarea
                        className="new-comment-input"
                        value={newComment}
                        onChange={handleInputChange}
                        placeholder="Write a comment..."
                        rows={1}
                    ></textarea>
                    <button className="submit-comment-button" onClick={handleNewComment}>
                        Post
                    </button>
                </div>
                {comments ? (
                    comments.map((comment: any) => (
                        <div className="post-card" key={comment.id}>
                            <div className="post-header">
                                <img
                                    src={comment.user.profileImage}
                                    alt={`${comment.user.first_name}'s profile`}
                                    className="profile-pic"
                                />
                                <div className="user-info">
                                    <strong>
                                        {comment.user.first_name} {comment.user.last_name}
                                    </strong>
                                    <span className="timestamp">{formatTime(comment.created_at)}</span>
                                </div>
                            </div>
                            {comment.content && <p className="post-content">{comment.content}</p>}
                            <div className="separator"></div>
                            <div className="post-actions">
                                <button
                                    className={`like-button ${comment.isLiked ? "liked" : ""}`}
                                    onClick={() => toggleLike(comment.id)}
                                >
                                    {comment.isLiked ? "❤️" : "🖤"} {comment.likes}
                                </button>
                                <button className="comment-button" onClick={() => navigate(`/comments/${comment.id}`)}>💬 {comment.comments}</button>
                                <button className="share-button">🔗 Share</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default Comments;
