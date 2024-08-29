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

    function sendActivationOTP(user_id: string) {
        api.post(`/user/send-verification-email/${user_id}`, { email }).then((res) => {
            try {
                if (res.data.status != "success") {
                    console.log(res.data);
                    Notify("An error occurred", "error", "Error");
                    setLoader(false);
                }
                Notify("Check your email for account activation", "info", "Info");
            } catch {
                console.log(res.data);
                Notify("An error occurred", "error", "Error");
                setLoader(false);
            }
        });
    }

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        const signin = e;
        setLoader(true);
        let req = api.post("/user/login/", { email, password });

        req.then((res) => {
            try {
                if (res.data.status == "success - otp") {
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
                Notify(error.message, "error", "Error");
                if (error.status == "unauthorized-inactive") {
                    let user_id = '';

                    api.post("/user/find-account/", { email }).then((res) => {

                        try {
                            if (res.data.status == "success") {
                                user_id = res.data.data;

                                sendActivationOTP(user_id);

                                let maxKey = Math.max(...popups.map((popup: any) => popup.key));
                                let activatePopup = (
                                    <Popup
                                        key={maxKey + 1}
                                        title="Activate Account"
                                        inputs={[{ type: "text", name: "otp", placeholder: "OTP" }]}
                                        submit="Activate"
                                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target as HTMLFormElement);
                                            let otp = formData.get("otp") as string;
                                            if (!otp || otp.length != 6) {
                                                Notify("Invalid OTP", "error", "Error");
                                                return;
                                            }
                                            setLoader(true);
                                            let req = api.post(`/user/verify/${user_id}`, { otp });
                                            req.then((res) => {
                                                try {
                                                    if (res.data.status == "unauthorized") {
                                                        Notify("Invalid OTP", "error", "Error");
                                                        setLoader(false);
                                                        return;
                                                    } else if (res.data.status == "success") {
                                                        Notify("Account activated", "success", "Success");
                                                        setLoader(false);
                                                        handleSignIn(signin);
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

                                setPopups([...popups, activatePopup]);


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
                    }, (err) => {
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
                    setLoader(false);
                    // Initiate account activation - Todo
                    return;
                }
            } catch {
                console.log(err);
                Notify("An error occurred", "error", "Error");
            }
            setLoader(false);
        });

    };

    const forgotPassword = () => {
        console.error("Forgot password");
        
        let maxKey = Math.max(...popups.map((popup: any) => popup.key));

        let forgotPasswordPopup = (
            <Popup
                key={maxKey + 1}
                title="Forgot Password"
                inputs={[{ type: "email", name: "email", placeholder: "Email" }]}
                submit="Reset"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    let email = formData.get("email") as string;
                    if (!email) {
                        Notify("Invalid email", "error", "Error");
                        return;
                    }
                    setLoader(true);
                    let req = api.post("/user/send-reset-password-otp", { email });
                    req.then((res) => {
                        try {
                            if (res.data.status == "success") {
                                Notify("Password reset link sent to email", "success", "Success");
                                setLoader(false);
                                let otp_popup = (
                                    <Popup
                                        key={maxKey + 2}
                                        title="Enter OTP"
                                        inputs={[{ type: "text", name: "otp", placeholder: "OTP" }]}
                                        submit="Confirm OTP"
                                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target as HTMLFormElement);
                                            let otp = formData.get("otp") as string;
                                            if (!otp || otp.length != 6) {
                                                Notify("Invalid OTP", "error", "Error");
                                                return;
                                            }
                                            setLoader(true);
                                            let req = api.post("/user/verify-otp", { 
                                                "email": email,
                                                "otp": otp,
                                                "purpose": "forgot_password",
                                            });
                                            req.then((res) => {
                                                try {
                                                    if (res.data.status == "success") {
                                                        Notify("OTP verified", "success", "Success");
                                                        setLoader(false);
                                                        let resetPassword = (
                                                            <Popup
                                                                key={maxKey + 3}
                                                                title="Reset Password"
                                                                inputs={[
                                                                    { type: "password", name: "password", placeholder: "New Password" },
                                                                    { type: "password", name: "confirm_password", placeholder: "Confirm Password" },
                                                                ]}
                                                                submit="Reset Password"
                                                                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                                                    e.preventDefault();
                                                                    const formData = new FormData(e.target as HTMLFormElement);
                                                                    let password = formData.get("password") as string;
                                                                    let confirm_password = formData.get("confirm_password") as string;
                                                                    console.log(`password : ${password} confirm_password : ${confirm_password}`);
                                                                    if (!password || !confirm_password || password != confirm_password) {
                                                                        Notify("Passwords do not match", "error", "Error");
                                                                        return;
                                                                    }
                                                                    setLoader(true);
                                                                    let req = api.post("/user/reset-password", { email, password, otp });
                                                                    req.then((res) => {
                                                                        try {
                                                                            if (res.data.status == "success") {
                                                                                Notify("Password reset successful", "success", "Success");
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
                                                        setPopups([...popups, resetPassword]);
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
                                setPopups([...popups, otp_popup ]);

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
                }}
            />
        );

        setPopups([...popups, forgotPasswordPopup]);
    }


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
                <div className="btn transparent" id="forgot-password" onClick={forgotPassword}>Forgot Password</div>
            </form>
            
        </>
    );
};

export default SignInForm;