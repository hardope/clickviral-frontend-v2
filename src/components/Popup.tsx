import "../styles/Popup.css"

interface Props {
    title: string;
    inputs: Array<{
        type: string;
        name: string;
        placeholder: string;
    }>,
    submit: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Popup = ({title, inputs, submit, onSubmit}: Props) => {
    // const [isOpen, setIsopen]
    return (
        <>
            <div className="popup">
                <div className="popup-content">
                    <h2>{title}</h2>
                    <form onSubmit={onSubmit}>
                        {inputs.map((input, index) => (
                            <input key={index} type={input.type} name={input.name} placeholder={input.placeholder} />
                        ))}
                        <button type="submit">{submit}</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Popup