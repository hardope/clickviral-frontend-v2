import "../../styles/Auth.css"
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { LeftPanel, RightPanel } from "./Panels";

const AuthForm = () => {     

    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <SignInForm />
                    <SignUpForm />
                </div>
            </div>
            <div className="panels-container">
                <LeftPanel onClick={() => {
                    const container = document.querySelector('.container');
                    container?.classList.add('sign-up-mode');
                }} />
                <RightPanel onClick={() => {
                    const container = document.querySelector('.container');
                    container?.classList.remove('sign-up-mode');
                }} />
            </div>
        </div>
    )
}

export default AuthForm