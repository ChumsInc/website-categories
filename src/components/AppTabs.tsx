import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {tabListCreatedAction, Tab, TabList} from "chums-ducks";

export const categoryTab_edit = 'edit';
export const categoryTab_items = 'items';

export const categoryTabKey = 'category-edit';
export const categoryTabID = {
    edit: 'edit',
    items: 'items'
};

const categoryTabs:Tab[] = [
    {id: categoryTab_edit, title: 'Edit Category', icon: 'bi-pencil-fill'},
    {id: categoryTab_items, title: 'Sort Items', icon: 'bi-filter-square-fill'},
];

const AppTabs:React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(tabListCreatedAction(categoryTabs, categoryTabKey, categoryTab_edit));
    }, []);

    return (
        <TabList tabKey={categoryTabKey} className="mb-1" />
    )
}

export default AppTabs;
