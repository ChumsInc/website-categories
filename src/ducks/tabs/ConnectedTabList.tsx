import React from 'react';
import {onTabRemoved, onTabSelected, selectedTabSelector, tabListSelector} from "./index";
import {useDispatch, useSelector} from "react-redux";
import TabList from "../../common-components/TabList";


export interface TabListProps {
    className?: string,
}

const ConnectedTabList: React.FC<TabListProps> = ({className, children}) => {
    const dispatch = useDispatch();
    const list = useSelector(tabListSelector)
    const selected = useSelector(selectedTabSelector);

    return (
        <TabList className={className} list={list} selected={selected}
                 onClick={id => dispatch(onTabSelected(id))}
                 onClose={id => dispatch(onTabRemoved(id))}
                 children={children}/>
    )
}

export default ConnectedTabList;
