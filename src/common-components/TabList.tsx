import React from 'react';
import classNames from "classnames";
import TabItem from "./TabItem";
import {Tab} from "../types";
import './TabList.css';

export interface TabListProps {
    className?: string,
    list: Tab[],
    selected: string,
    onClick: (id: string) => void,
    onClose?: (id: string) => void,
}

export const TabList: React.FC<TabListProps> = ({
                                                    className,
                                                    list,
                                                    selected,
                                                    onClick,
                                                    onClose,
                                                    children
                                                }) => {
    return (
        <ul className={classNames('nav nav-tabs', className)}>
            {list.map(tab => (
                <TabItem key={tab.id} id={tab.id} title={tab.title} onSelect={onClick} disabled={tab.disabled}
                         active={tab.id === selected} canClose={tab.canClose} onClose={onClose}/>
            ))}
            {children}
        </ul>
    )
}

export default TabList;
