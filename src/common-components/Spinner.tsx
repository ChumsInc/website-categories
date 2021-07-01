import React, {HTMLAttributes} from 'react';
import {BootstrapColor} from "../types";
import classNames from "classnames";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
    type?: 'border' | 'grow',
    bsSize?: 'sm',
    hiddenLabel?: string,
    color?: BootstrapColor,
}

const Spinner: React.FC<SpinnerProps> = ({
                                             type,
                                             bsSize,
                                             role = 'status',
                                             hiddenLabel,
                                             color,
                                             className,
                                             ...rest
                                         }) => {

    const spinnerClassName = {
        'spinner-border': type === 'border',
        'spinner-grow': type === 'grow',
        [`spinner-border-${bsSize}`]: !!bsSize,
        [`text-${color}`]: !!color,
    }
    return (
        <div className={classNames(spinnerClassName, className)} role={role} {...rest}>
            {!!hiddenLabel && (<span className="visually-hidden">{hiddenLabel}</span>)}
        </div>
    )
}

export default Spinner;
