import React, { useState } from "react";
import Input from "./AuthInput";
import Notify from "../../utils/Notify";
import Loader from "../Loader";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../environment";
import { Navigate } from "react-router-dom";
import Popup from "../Popup";

const SignInForm = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const [popups, setPopups] = useState<any>([]);


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
                console.log(res.data.status);
                if (res.data.status == "unauthorized"){
                    Notify("Invalid email or password", "error", "Error");
                    setLoader(false);
                    return;
                } else if (res.data.status == "unauthorized-inactive") {
                    Notify("Account is inactive", "error", "Error");
                    setLoader(false);
                    // Initiate account activation - Todo
                    return;
                } else if (res.data.status == "success - otp") {
                    Notify("OTP sent to email", "success", "Success");
                    let maxKey = Math.max(...popups.map((popup: any) => popup.key));
                    let signInPopup = (
                        <Popup
                            key={maxKey + 1}
                            title="Enter OTP"
                            inputs={[{ type: "text", name: "otp", placeholder: "OTP" }]}
                            submit="Verify"
                            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                console.log("OTP verification");
                                const formData = new FormData(e.target as HTMLFormElement);
                                let otp = formData.get("otp") as string;
                                if (!otp || otp.length != 6) {
                                    Notify("Invalid OTP", "error", "Error");
                                    return;
                                }
                                setLoader(true);
                                let req = api.post("/user/two-factor-login/", { email, otp });
                                req.then((res) => {
                                    try {
                                        if (res.data.status == "unauthorized") {
                                            Notify("Invalid OTP", "error", "Error");
                                            setLoader(false);
                                            return;
                                        } else if (res.data.status == "success") {
                                            const data = res.data.data;
                                            localStorage.setItem(ACCESS_TOKEN, data.token);
                                            localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                                            Notify("Login successful", "success", "Success");
                                            IsAuthenticated();
                                            setLoader(false);
                                        } else {
                                            console.log(res.data);
                                            Notify(res.data.message, "error", "Error");
                                            setLoader(false);
                                        }
                                    } catch {
                                        console.log(res.data);
                                        Notify("An error occurred", "error", "Error");
                                        setLoader(false);
                                    }
                                }).catch((err) => {
                                    try {
                                        const error = err.response.data;
                                        console.log(error);
                                        Notify(error.message, "error", "Error");
                                    } catch {
                                        console.log(err);
                                        Notify("An error occurred", "error", "Error");
                                    }
                                    setLoader(false);
                                });
                            }}
                        />
                    );
                    setPopups([...popups, signInPopup]);
                    setLoader(false);
                    // Initiate OTP verification - Todo
                    return;
                } else if (res.data.status == "success") {
                    const data = res.data.data;
                    localStorage.setItem(ACCESS_TOKEN, data.token);
                    localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                    Notify("Login successful", "success", "Success");
                    IsAuthenticated();
                    setLoader(false);
                } else {
                    console.log(res.data);
                    Notify("An error occurred", "error", "Error");
                    setLoader(false);
                }
                
            } catch {
                console.log(res.data);
                Notify("An error occurred", "error", "Error");
                setLoader(false);
            }
        }).catch((err) => {
            try {
                const error = err.response.data;
                console.log(error);
                Notify(error.message, "error", "Error");
            } catch {
                console.log(err);
                Notify("An error occurred", "error", "Error");
            }
            setLoader(false);
        });

    };

    return (
        <>
            {isAuthenticated && <Navigate to="/" replace />}
            {loader && <Loader />}
            {popups}
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