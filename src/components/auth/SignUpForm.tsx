import React, { useState } from "react";
import Input from "./AuthInput";

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
        console.log(username, email, firstName, lastName, password, confirmPassword);
    };

    return (
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
    );
};

export default SignUpForm;