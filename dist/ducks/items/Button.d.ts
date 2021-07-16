import React, { ButtonHTMLAttributes, MouseEvent } from 'react';
import { InputField } from "../types";
interface ButtonProps extends ButtonHTMLAttributes<any> {
    field?: string;
    value?: any;
    onClick?: (props?: InputField | MouseEvent<HTMLButtonElement>) => void;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
