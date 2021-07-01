import React from 'react';
import classNames from "classnames";

export interface ProgressProps {
    height?: string,
    style?: any,
    className?: string | object,
}

const Progress: React.FC<ProgressProps> = ({
                                                  height,
                                                  className = '',
                                                  style = {},
                                                  children
                                              }) => {
    if (height && !style.height) {
        style.height = height;
    }

    return (
        <div className={classNames('progress', className)} style={style}>
            {children}
        </div>
    )
}

export default Progress;
