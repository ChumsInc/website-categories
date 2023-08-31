import React, {ChangeEvent} from "react";
import {Select} from "chums-components";

export interface SEOPrioritySelectProps {
    value: number,
    required?: boolean,
    onChange: (value: number) => void,
}

const SEOPrioritySelect = ({value, required = false, onChange}: SEOPrioritySelectProps) => {
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(ev.target.value))
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
