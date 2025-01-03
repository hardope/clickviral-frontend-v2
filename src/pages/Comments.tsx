import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Comments.css";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const Comments = () => {
    const [post, setPost] = useState<any>();
    const [comments, setComments] = useState<any>([]);
    const [newComment, setNewComment] = useState<string>("");

    const { id } = useParams<{ id: string }>();

    const toggleLike = (id: string) => {
        const updatedPosts = comments.map((comment: any) => {
            if (comment.id === id) {
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
        setComments([
            ...comments,
            {
                id: Date.now().toString(),
                user: { first_name: "You", last_name: "", profileImage: "" },
                content: newComment,
                created_at: new Date().toISOString(),
                isLiked: false,
                likes: 0,
            },
        ]);
        setNewComment(""); // Clear input
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
                {comments.length > 0 ? (
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
