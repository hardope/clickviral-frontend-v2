import React, { useState } from "react";
import "../styles/CreatePost.css";
import api from "../api";
import Notify from "../utils/Notify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [content, setContent] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);

            // Handle file preview
            const fileType = file.type;
            if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
                setFilePreview(URL.createObjectURL(file));
            } else if (fileType === "application/pdf") {
                setFilePreview("/images/pdf-preview.svg"); // Placeholder for PDF preview
            } else {
                setFilePreview(null);
                Notify("Unsupported file type", "error", "Error");
            }
        }
    };

    const handlePostSubmit = () => {
        if (!content.trim() && !file) {
            Notify("Please add content or a file to post", "error", "Error");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        if (file) {
            formData.append("file", file);
        }

        api.post("/posts/create", {
            content: content,
            file: file ? file : undefined,
            type: "post"
        })
        .then(() => {
            Notify("Post created successfully!", "success", "Success");
            navigate("/");
        })
        .catch((err) => {
            console.error(err);
            Notify("Failed to create post", "error", "Error");
        });
    };

    return (
        <div className="create-post-page">
            <button className="close-button" onClick={() => navigate("/")}>
                ×
            </button>
            <h2>Create Post</h2>
            <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={handleContentChange}
                className="post-content-input"
            />
            <div className="file-upload-section">
                <label className="file-upload-button">
                    <img src="/images/picture.svg" alt="Upload" className="icon"/>
                    <input type="file" accept="image/*,video/*,application/pdf" onChange={handleFileChange} />
                </label>
                <button
                    className="camera-button"
                    onClick={() => {
                        navigator.mediaDevices
                            .getUserMedia({ video: true })
                            .then((stream) => {
                                const video = document.createElement("video");
                                video.srcObject = stream;
                                video.play();
                                document.body.appendChild(video);
                            })
                            .catch((err) => console.error(err));
                    }}
                >
                    <img src="/images/camera.svg" alt="Capture"className="icon" />
                </button>
            </div>
            {filePreview && (
                <div className="file-preview">
                    {file?.type.startsWith("image/") ? (
                        <img src={filePreview} alt="Preview" />
                    ) : file?.type.startsWith("video/") ? (
                        <video controls src={filePreview} />
                    ) : file?.type === "application/pdf" ? (
                        <img src={filePreview} alt="PDF Preview" />
                    ) : null}
                </div>
            )}
            <button className="submit-post-button" onClick={handlePostSubmit}>
                Post
            </button>
        </div>
    );
};

export default CreatePost;
