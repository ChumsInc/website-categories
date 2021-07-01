import React from 'react';
import {BootstrapColor} from "../types";
import classNames from "classnames";

export interface ProgressBarProps {
    color?: BootstrapColor,
    value?: number,
    valueMin?: number,
    valueMax?: number,
    striped?: boolean,
    animated?: boolean,
    className?: string | object,
    style?: object,
}

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                     color = 'primary',
                                                     value = 100,
                                                     valueMin = 0,
                                                     valueMax = 100,
                                                     striped,
                                                     animated,
                                                     className = '',
                                                     style = {},
                                                     children,
                                                 }) => {
    let width = 1 - ((valueMax - value) / (valueMax - valueMin));
    if (width < 0) {
        width = 0;
    } else if (width > 1) {
        width = 1;
    }
    const progressBarClassName = {
        'progress-bar': true,
        'progress-bar-striped': striped || animated,
        'progress-bar-animated': animated,
    }
    return (
        <div className={classNames(`bg-${color}`, {...progressBarClassName}, className)}
             role="progressbar" style={{width: `${width * 100}%`, ...style}}>
            {children || null}
        </div>
    )
}

export default ProgressBar;
