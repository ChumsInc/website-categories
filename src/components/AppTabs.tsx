import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {tabListCreatedAction, Tab} from "../ducks/tabs";
import TabList from "../ducks/tabs/TabList";

export const TAB_KEY = 'app';
export const TABS = {
    edit: 'edit',
    items: 'items'
};

export const TAB_LIST:Tab[] = [
    {id: TABS.edit, title: 'Edit Category'},
    {id: TABS.items, title: 'Items'},
];

const AppTabs:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tabListCreatedAction(TAB_LIST, TAB_KEY))
    }, []);

    return (
        <TabList tabKey={TAB_KEY} />
    )
}

export default AppTabs;
