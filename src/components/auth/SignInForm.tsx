import React, { useState } from "react";
import Input from "./AuthInput";
import Notify from "../../utils/Notify";
import Loader from "../Loader";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../environment";
import { Navigate } from "react-router-dom";

const SignInForm = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);

    function IsAuthenticated() {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) {
            setIsAuthenticated(false);
        }

        setIsAuthenticated(true);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        let req = api.post("/user/login/", { email, password });

        req.then((res) => {
            try {
                const data = res.data.data;
                localStorage.setItem(ACCESS_TOKEN, data.token);
                localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                Notify("Login successful", "success", "Success");
                IsAuthenticated();
                setLoader(false);
            } catch {
                Notify("An error occurred", "error", "Error");
                setLoader(false);
            }
        }).catch((err) => {
            try {
                const error = err.response.data;
                console.log(error);
                Notify(error.message, "error", "Error");
            } catch {
                Notify("An error occurred", "error", "Error");
            }
            setLoader(false);
        });

    };

    return (
        <>
            {isAuthenticated && <Navigate to="/" replace />}
            {loader && <Loader />}
            <form action="#" className="sign-in-form" onSubmit={handleSignIn} aria-disabled={loader}>
                <h2 className="title">Sign in</h2>
                <Input iconClass="fa-envelope" type="email" placeholder="Email" onChange={handleEmailChange} required={true} />
                <Input iconClass="fa-lock" type="password" placeholder="Password" onChange={handlePasswordChange} required={true} />
                <input type="submit" value="Login" className="btn solid" disabled={loader} />
                <button className="btn transparent" id="forgot-password">Forgot Password</button>
            </form>
        </>
    );
};

export default SignInForm;