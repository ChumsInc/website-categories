import React, {ChangeEvent} from "react";
import Input from "./Input";
import {InputField} from "../ducks/types";


interface FieldInputProps {
    field: string,
    value: string,
    placeholder?: string,
    required?: boolean,
    readOnly?: boolean,
    disabled?: boolean,
    onChange: ({field, value}: InputField) => void,
}

const FieldInput: React.FC<FieldInputProps> = ({field, value, placeholder, required, readOnly, disabled, onChange}) => {
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        onChange({field, value: ev.target.value});
    }
    return (
        <Input type="text" value={value} onChange={changeHandler} placeholder={placeholder} required={required}
               readOnly={readOnly} disabled={disabled}/>
    )
}

export default FieldInput;
