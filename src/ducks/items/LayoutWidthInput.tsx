import React, {ChangeEvent, HTMLAttributes} from 'react';

export type MuiWidthKey = 'xs'|'sm'|'md'|'lg'|'xl';

export interface LayoutWidthInputProps extends HTMLAttributes<HTMLInputElement> {
    size: MuiWidthKey;
    value: string|number;
    onChange: (ev:ChangeEvent<HTMLInputElement>) => void;
}
const LayoutWidthInput = ({size, value, onChange, ...rest}:LayoutWidthInputProps) => {
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">{size}</div>
            <input type="text" value={value ?? ''} onChange={onChange}
                   className="form-control form-control-sm" {...rest} />
        </div>
    )
}

export default LayoutWidthInput;
