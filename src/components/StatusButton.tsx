import React from "react";
import classNames from "classnames";

export interface StatusButtonProps {
    status: boolean,
    onChange: (status:boolean) => void,
}

const StatusButton:React.FC<StatusButtonProps> = ({status, onChange}) => {
    const onClickEnabled = () => onChange(true);
    const onClickDisabled = () => onChange(false);
    const enabledButtonClassName = classNames('btn btn-sm', {
        'btn-outline-success': !status,
        'btn-success': status
    });
    const disabledButtonClassName = classNames('btn btn-sm', {
        'btn-outline-danger': status,
        'btn-danger': !status
    });

    return (
        <div className="btn-group btn-group-sm">
            <button type="button" className={enabledButtonClassName} onClick={onClickEnabled}>
                Enabled
            </button>
            <button type="button" className={disabledButtonClassName} onClick={onClickDisabled}>
                Disabled
            </button>
        </div>
    )
}

export default StatusButton;
