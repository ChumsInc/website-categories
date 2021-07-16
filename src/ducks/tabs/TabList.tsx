import React from 'react';
import {tabRemovedAction, tabSelectedAction, selectedTabSelector, tabListSelector} from "./index";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import TabItem from "./TabItem";
import './TabList.scss';


export interface TabListProps {
    tabKey: string,
    className?: string,
}

const TabList: React.FC<TabListProps> = ({tabKey, className, children}) => {
    const dispatch = useDispatch();
    const list = useSelector(tabListSelector(tabKey))
    const selected = useSelector(selectedTabSelector(tabKey));

    const tabClickHandler = (id:string) => {
        console.log(id, tabKey);
        dispatch(tabSelectedAction(id, tabKey));
    }
    const tabCloseHandler = (id:string) => dispatch(tabRemovedAction(id, tabKey));

    return (
        <ul className={classNames('nav nav-tabs', className)}>
            {list.map(tab => (
                <TabItem key={tab.id} id={tab.id} title={tab.title}
                         onSelect={() => tabClickHandler(tab.id)}
                         disabled={tab.disabled}
                         active={tab.id === selected}
                         canClose={tab.canClose} onClose={() =>tabCloseHandler(tab.id)}/>
            ))}
            {children}
        </ul>
    )
}

export default TabList;
