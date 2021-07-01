import React from "react";
import classNames from "classnames";

interface InputGroupProps {
    bsSize?: 'sm'|'lg',
    className?: string|object,
}
const InputGroup:React.FC<InputGroupProps> = ({bsSize = 'sm', className, children}) => {
    return (
        <div className={classNames('input-group', {[`input-group-${bsSize}`]: !!bsSize}, className)}>
            {children}
        </div>
    )
}

export default InputGroup;
