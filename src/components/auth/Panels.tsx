import icon from '../../assets/icon.png';

type LeftPanelProps = {
    onClick: () => void;
};

const LeftPanel = ({ onClick }: LeftPanelProps) => (
    <div className="panel left-panel">
        <div className="content">
        <h1>ClickViral</h1>
        <h3>Don't have an account?</h3>
        <p></p>
        <button className="btn transparent" id="sign-up-btn" onClick={onClick}>Sign Up</button>
        </div>
        <img src={icon} className="image" alt="" />
    </div>
    );

type RightPanelProps = {
    onClick: () => void;
};

const RightPanel = ({ onClick }: RightPanelProps) => (
    <div className="panel right-panel">
        <div className="content">
        <h1>ClickViral</h1>
        <h3>Sign In to Your account</h3>
        <p></p>
        <button className="btn transparent" id="sign-in-btn" onClick={onClick}>Sign In</button>
        </div>
        <img src={icon} className="image" alt=""/>
    </div>
    );

export { LeftPanel, RightPanel };