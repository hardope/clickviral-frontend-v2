import React from 'react'

interface InputProps {
    iconClass: string;
    type: string;
    placeholder: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ iconClass, type, placeholder, required, onChange }) => (
    <div className="input-field">
        <i className={`fas ${iconClass}`}></i>
        <input type={type} placeholder={placeholder} onChange={onChange} required={required} />
    </div>
);

export default Input