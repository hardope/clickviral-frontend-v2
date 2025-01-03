import React, { useState, useRef } from "react";
import "../styles/CreatePost.css";
import api from "../api";
import Notify from "../utils/Notify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [content, setContent] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const navigate = useNavigate();

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
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
                setFilePreview("/images/pdf-preview.svg");
            } else {
                setFilePreview(null);
                Notify("Unsupported file type", "error", "Error");
            }
        }
    };

    // const handleCameraClick = () => {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true })
    //         .then((stream) => {
    //             setCameraActive(true);
    //             if (videoRef.current) {
    //                 videoRef.current.srcObject = stream;
    //                 videoRef.current.play();
    //             }
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             Notify("Unable to access camera", "error", "Error");
    //         });
    // };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const imageData = canvasRef.current.toDataURL("image/png");
                setCapturedImage(imageData);
                setFilePreview(imageData);
            }
        }
        stopCameraStream();
    };

    const stopCameraStream = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
        }
        setCameraActive(false);
    };

    const handlePostSubmit = () => {
        if (!content.trim() && !file && !capturedImage) {
            Notify("Please add content or a file to post", "error", "Error");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        if (file) {
            formData.append("file", file);
        } else if (capturedImage) {
            formData.append("file", capturedImage);
        }

        api.post("/posts/create", formData)
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
                    <img src="/images/picture.svg" alt="Upload" className="icon" />
                    <input type="file" accept="image/*,video/*,application/pdf" onChange={handleFileChange} />
                </label>
                <button className="camera-button" >
                    <img src="/images/camera.svg" alt="Capture" className="icon" />
                </button>
            </div>
            {cameraActive && (
                <div className="camera-interface">
                    <video ref={videoRef} className="camera-preview" />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <button className="capture-button" onClick={handleCapture}>
                        Capture
                    </button>
                </div>
            )}
            {filePreview && (
                <div className="file-preview">
                    {file?.type?.startsWith("image/") || capturedImage ? (
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
