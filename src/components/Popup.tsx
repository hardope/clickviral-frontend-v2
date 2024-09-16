import "../styles/Popup.css";

interface Props {
    title: string;
    inputs: Array<{
        type: string;
        name: string;
        placeholder: string;
    }>;
    submit: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void; // New prop for closing the popup
}

const popup = ({ title, inputs, submit, onSubmit, onClose }: Props) => {
    return (
        <>
            <div className="popup">
                <div className="popup-content">
                    <button className="popup-close" onClick={onClose}>
                        &times;
                    </button>
                    <h2>{title}</h2>
                    <form onSubmit={onSubmit}>
                        {inputs.map((input, index) => (
                            <input
                                key={index}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                            />
                        ))}
                        <button type="submit">{submit}</button>
                    </form>
                </div>
            </div>
        </>
    );
};

const closepopup = (key: any, setPopups: any, popups: any) => {

    setPopups(popups.filter((popup: any) => popup.key !== key));
}

export const closePopup = closepopup;
export const Popup = popup;