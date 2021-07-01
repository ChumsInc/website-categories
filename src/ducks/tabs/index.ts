import {Action, combineReducers} from 'redux';
import {RootState} from "../index";
import {Tab} from "../../types";


export const tabListCreated = 'app/tabs/tabs-created';
export const tabSelected = 'app/tabs/tab-selected';
export const tabAdded = 'app/tabs/tab-added';
export const tabRemoved = 'app/tabs/tab-removed';
export const tabDisabled = 'app/tabs/tab-disabled';


export interface TabAction extends Action {
    payload: {
        id?: string,
        tab?: Tab,
        list?: Tab[]
    }
}

export const onTabListCreated = (list:Tab[]):TabAction => ({type: tabListCreated, payload: {list}});
export const onTabSelected = (id:string):TabAction => ({type: tabSelected, payload: {id}});
export const onTabAdded = (tab:Tab):TabAction => ({type: tabAdded, payload: {tab}});
export const onTabRemoved = (id:string):TabAction => ({type: tabRemoved, payload: {id}})
export const onTabDisabled = (id:string):TabAction => ({type: tabDisabled, payload: {id}})

export const tabListSelector = (state:RootState) => state.tabs.list;
export const selectedTabSelector = (state:RootState) => {
    const {list, selected} = state.tabs
    const [id] = list.filter(tab => tab.id === selected).map(tab => tab.id);
    return id || '';
}
export const tabSelector = (id:string) => (state:RootState) => {
    const [tab] = state.tabs.list.filter(tab => tab.id === id);
    return tab;
}


const listReducer = (state:Tab[] = [], action:TabAction) => {
    const {type, payload} = action;
    const {id, tab, list = []} = payload || {};
    switch (type) {
    case tabListCreated:
        return [...list];
    case tabAdded:
        if (!tab) {
            return state;
        }
        return [...state, tab];
    case tabRemoved:
        if (!id) {
            return state;
        }
        return state.filter(tab => tab.id !== id);
    case tabDisabled:
        if (!id) {
            return state;
        }
        return state.map(tab => ({...tab, disabled: tab.id === id}));
    default:
        return  state;
    }
}

const selectedReducer = (state:string = '', action:TabAction) => {
    const {type, payload} = action;
    switch (type) {
    case tabSelected:
        return payload.id || '';
    case tabAdded:
        if (!payload.tab) {
            return state;
        }
        return payload.tab.id;
    case tabRemoved:
    case tabDisabled:
        if (payload.id === state) {
            return '';
        }
        return state;
    case tabListCreated:
        if (payload.list) {
            const [id = ''] = payload.list.filter(tab => tab.active).map(tab => tab.id)
            return id;
        }
        return state;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
});
