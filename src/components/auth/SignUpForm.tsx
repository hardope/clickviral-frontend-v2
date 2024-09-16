import React, { useState } from "react";
import Input from "./AuthInput";
import Loader from "../Loader";
import api from "../../api";
import Notify from "../../utils/Notify";
import {Popup, closePopup} from "../Popup";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../environment";

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const [popups, setPopups] = useState<React.ReactNode[]>([]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        // console.log(username, email, firstName, lastName, password, confirmPassword);

        if (password !== confirmPassword) {
            setLoader(false);
            Notify("Passwords do not match", "error", "Error");
            return;
        }

        let req = api.post("/user/create", {
            username,
            email,
            first_name: firstName,
            last_name: lastName,
            password,
        });

        req.then((res) => {
            let data = res.data;
            setLoader(false);

            try {
                if (data.status === "success") {
                    // console.log(data.data.id);
                    let user_id = data.data.id;
                    Notify(data.message, "success", "Success");
                    let maxKey = Math.max(...popups.map((popup: any) => popup.key));
                    let getStartedPopup = (

                        <Popup
                            key={maxKey + 1}
                            title="Enter OTP"
                            inputs={[{ type: "text", name: "otp", placeholder: "OTP" }]}
                            submit="Verify"
                            onClose={() => closePopup(maxKey+1, setPopups, popups)}
                            onSubmit={(e: React.FormEvent) => {
                                e.preventDefault();
                                setLoader(true);
                                let formdata = new FormData(e.target as HTMLFormElement);
                                let otp = formdata.get("otp") as string;
                                
                                req = api.post(`/user/verify/${user_id}`, { otp });
                                req.then((res) => {
                                    setLoader(false);
                                    data = res.data;
                                    if (data.status === "success") {
                                        Notify(data.message, "success", "Success");
                                        setPopups([]);
                                        req = api.post("/user/login", { email, password });
                                        req.then((res) => {
                                            data = res.data;
                                            if (data.status === "success") {
                                                Notify(data.message, "success", "Success");
                                                console.log(data.data);
                                                localStorage.setItem(ACCESS_TOKEN, data.data.token);
                                                localStorage.setItem(REFRESH_TOKEN, data.data.refreshToken);
                                                window.location.href = "/";
                                            } else {
                                                Notify(data.message, "error", "Error");
                                            }
                                        });
                                    } else {
                                        Notify(data.message, "error", "Error");
                                    }
                                }); 
                                req.catch((err) => {
                                    Notify(err.response.data.message, "error", "Error");
                                    setLoader(false);
                                });                             
                            }
                            }
                        />

                    );
                    setPopups([...popups, getStartedPopup]);

                } else {
                    Notify(data.message, "error", "Error");
                }
            } 
            catch (err) {
                console.log(err);
                Notify("An error occurred", "error", "Error");

            }
        });

        req.catch((err) => {
            setLoader(false);
            Notify(err.response.data.message, "error", "Error");
        });
    };

    return (
        <>
            {loader && <Loader />}
            {popups}
            <form action="#" className="sign-up-form" onSubmit={handleSignUp}>
                <h2 className="title">Sign up</h2>
                <Input iconClass="fa-user" type="text" placeholder="Username" onChange={handleUsernameChange} required={true} />
                <Input iconClass="fa-envelope" type="email" placeholder="Email" onChange={handleEmailChange} required={true} />
                <Input iconClass="fa-user" type="text" placeholder="First Name" onChange={handleFirstNameChange} required={true} />
                <Input iconClass="fa-user" type="text" placeholder="Last Name" onChange={handleLastNameChange} required={true} />
                <Input iconClass="fa-lock" type="password" placeholder="Password" onChange={handlePasswordChange} required={true} />
                <Input iconClass="fa-lock" type="password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} required={true} />
                <input type="submit" className="btn" value="Sign up" />
            </form>
        </>
    );
};

export default SignUpForm;