import React from "react";
import classNames from "classnames";

interface FormColumnProps {
    label: string,
    width?: number,
    className?: string,
}

const FormColumn:React.FC<FormColumnProps> = ({label, width = 8, className, children}) => {
    const labelClassName = {
        [`col-${12 - width}`]: !!width,
        'col-auto': !width,
        'form-label': true,
    }
    const containerClassName = {
        [`col-${width}`]: !!width,
        'col': !width,
    }
    return (
        <div className={classNames('row g-3', className)}>
            <label className={classNames(labelClassName)}>{label}</label>
            <div className={classNames(containerClassName)}>
                {children}
            </div>
        </div>
    )
}

export default FormColumn;
