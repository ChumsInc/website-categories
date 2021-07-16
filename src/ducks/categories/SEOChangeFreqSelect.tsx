import React, {ChangeEvent} from "react";
import {InputField} from "chums-ducks/dist/types";
import {Select} from "chums-ducks/dist/components";


export interface SEOChangeFreqSelectProps {
    value: string,
    field: string,
    required?: boolean,
    onChange: ({field, value}: InputField) => void,
}

const SEOChangeFreqSelect: React.FC<SEOChangeFreqSelectProps> = ({value, field, required = false, onChange}) => {
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        onChange({field, value: ev.target.value})
    }
    return (
        <Select value={value || ''} onChange={changeHandler} required={required}>
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
