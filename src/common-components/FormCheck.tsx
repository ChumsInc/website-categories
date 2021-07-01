import React from 'react';
import classNames from 'classnames';

export interface FormCheckProps {
    label: string,
    checked: boolean,
    onClick: () => void,
    inline?: boolean,
    className?: string | object,
    type: 'radio' | 'checkbox',
}

const FormCheck: React.FC<FormCheckProps> = ({
                                                 label,
                                                 checked,
                                                 onClick,
                                                 inline = false,
                                                 className = {},
                                                 type = "checkbox"
                                             }) => {
    return (
        <div className={classNames("form-check", className, {"form-check-inline": inline})}>
            <input type={type} className="form-check-input" checked={checked}
                   onChange={onClick}/>
            <label className="form-check-label" onClick={onClick}>
                {label}
            </label>
        </div>
    )
};

export default FormCheck;
