import React, {ButtonHTMLAttributes, MouseEvent} from 'react';
import {noop} from '../../utils';
import {InputField} from "../types";

interface ButtonProps extends ButtonHTMLAttributes<any> {
    field?: string,
    value?: any,
    onClick?: (props?: InputField|MouseEvent<HTMLButtonElement>) => void,
}
const Button:React.FC<ButtonProps> = ({type, onClick = noop, value, field, children, ...props}) => {
    const handleClick = (ev:MouseEvent<HTMLButtonElement>) => {
        if (!!field) {
            onClick({field, value});
            return;
        }
        onClick(ev);
    };
    return (
        <button type={type} {...props} onClick={handleClick}>{children || value}</button>
    )
};

export default Button;
