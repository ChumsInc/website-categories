import React from 'react';
import {noop} from '../utils';

const Button = ({type = "button", text, onClick = noop, value, field, ...props}) => {
    const handleClick = (ev) => {
        if (!!field) {
            onClick({field, value});
            return;
        }
        onClick(ev);
    };
    return (
        <button type={type} {...props} onClick={handleClick}>{text}</button>
    )
};

export default Button;
