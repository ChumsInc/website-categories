import React, {ChangeEvent} from "react";
import {InputField} from "chums-ducks/dist/types";
import {Select} from "chums-ducks/dist/components";

export interface SEOPrioritySelectProps {
    value: number,
    field: string,
    required?: boolean,
    onChange: ({field, value}: InputField) => void,
}

const SEOPrioritySelect: React.FC<SEOPrioritySelectProps> = ({value, field, required = false, onChange}) => {
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange({field, value: Number(ev.target.value)})
    }
    return (
        <Select value={value || ''} onChange={changeHandler} required={required} bsSize="sm">
            <option>Select One</option>
            <option value={0.0}>0.0</option>
            <option value={0.1}>0.1</option>
            <option value={0.2}>0.2</option>
            <option value={0.3}>0.3</option>
            <option value={0.4}>0.4</option>
            <option value={0.5}>0.5</option>
            <option value={0.6}>0.6</option>
            <option value={0.7}>0.7</option>
            <option value={0.8}>0.8</option>
            <option value={0.9}>0.9</option>
            <option value={1.0}>1.0</option>
        </Select>
    )
}

export default SEOPrioritySelect;
