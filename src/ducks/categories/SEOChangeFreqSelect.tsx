import React, {ChangeEvent} from "react";
import {Select} from "chums-components";


export interface SEOChangeFreqSelectProps {
    value: string,
    required?: boolean,
    onChange: (value: string) => void,
}

const SEOChangeFreqSelect = ({value, required = false, onChange}: SEOChangeFreqSelectProps) => {
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange(ev.target.value)
    }
    return (
        <Select value={value || ''} onChange={changeHandler} required={required} bsSize="sm">
            <option>Select One</option>
            <option value="n/a">Not Published</option>
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="never">never</option>
        </Select>
    )
}

export default SEOChangeFreqSelect;
