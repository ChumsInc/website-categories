import React, {MouseEvent} from "react";
import classNames from "classnames";
import {Tab} from "../types";


export interface TabItemProps extends Tab {
    onSelect: (id: string) => void,
    onClose?: (id: string) => void,
}

const TabItem: React.FC<TabItemProps> = ({
                                                    id,
                                                    title,
                                                    active,
                                                    canClose,
                                                    disabled,
                                                    onSelect,
                                                    onClose
                                                }) => {
    const onClick = (ev: MouseEvent) => {
        ev.preventDefault();
        if (disabled) {
            return;
        }
        onSelect(id);
    };

    const onClickClose = () => {
        if (canClose && !!onClose) {
            onClose(id);
        }
    }

    return (
        <li className="nav-item">
            <a className={classNames('nav-link', {active, disabled})}
               tabIndex={disabled ? -1 : 0}
               href="#" onClick={onClick}>
                {title}
                {canClose && (<button type="button" aria-label="Close" onClick={onClickClose} className="btn-close" />)}
            </a>

        </li>
    )
}
export default TabItem;
