import { RootState } from "../index";
import { ActionInterface } from "../types";
export interface Tab {
    id: string;
    title: string;
    canClose?: boolean;
    disabled?: boolean;
    active?: boolean;
}
export interface TabSet {
    list: Tab[];
    selected: string;
}
export interface TabAction extends ActionInterface {
    payload?: {
        key: string;
        id?: string;
        tab?: Tab;
        list?: Tab[];
    };
}
export interface TabsState {
    [key: string]: TabSet;
}
export declare const tabListCreated = "tabs/tabs-created";
export declare const tabSelected = "tabs/tab-selected";
export declare const tabAdded = "tabs/tab-added";
export declare const tabRemoved = "tabs/tab-removed";
export declare const tabDisabled = "tabs/tab-disabled";
export declare const tabListCreatedAction: (list: Tab[], key?: string) => TabAction;
export declare const tabSelectedAction: (id: string, key?: string) => TabAction;
export declare const tabAddedAction: (tab: Tab, key?: string) => TabAction;
export declare const tabRemovedAction: (id: string, key?: string) => TabAction;
export declare const tabDisabledAction: (id: string, key?: string) => TabAction;
export declare const tabListSelector: (key?: string) => (state: RootState) => import("chums-ducks").Tab[];
export declare const selectedTabSelector: (key?: string) => (state: RootState) => string;
export declare const tabSelector: (id: string, key?: string) => (state: RootState) => import("chums-ducks").Tab;
declare const tabsReducer: (state: TabsState | undefined, action: TabAction) => TabsState;
export default tabsReducer;
