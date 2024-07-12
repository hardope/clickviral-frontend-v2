import "../styles/Auth.css"
import icon from "../assets/icon.png"

const AuthForm = () => {
    return (
        <div>
            <div className="container">
                <div className="forms-container">
                    <div className="signin-signup">
                        <form action="#" className="sign-in-form">
                            <h2 className="title">Sign in</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" />
                            </div>
                            <input type="submit" value="Login" className="btn solid" />
                            <button className="btn transparent" id="forgot-password">Forgot Password</button>
                        </form>
                        <form action="#" className="sign-up-form">
                            <h2 className="title">Sign up</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="First Name" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Last Name" />
                            </div>
                                                     
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" />
                            </div>
                            <input type="submit" className="btn" value="Sign up" />
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h1>ClickViral</h1>
                        <h3>Don't have an account?</h3>
                        <p></p>
                        <button className="btn transparent" id="sign-up-btn" onClick={
                            () => {
                                const container = document.querySelector('.container');
                                container?.classList.add("sign-up-mode");
                            }
                        
                        }>Sign Up</button>
                    </div>
                    <img src={icon} className="image" alt="" />
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h1>ClickViral</h1>
                        <h3>Sign In to Your account</h3>
                        <p></p>
                        <button className="btn transparent" id="sign-in-btn" onClick={
                            () => {
                                const container = document.querySelector('.container');
                                container?.classList.remove("sign-up-mode");
                            }
                        }    
                        >Sign In</button>
                    </div>
                    <img src={icon} className="image" alt=""/>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AuthForm