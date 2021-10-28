import { ActionInterface, Category, Item, ItemType } from '../types';
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
import { EmptyObject } from "redux";
export declare const itemsSortChanged = "items/sortChanged";
export declare const itemSortSaveRequested = "items/saveSort";
export declare const itemSortSaveSucceeded = "items/saveSort-failed";
export declare const itemSortSaveFailed = "items/saveSort-failed";
export declare const itemSelected = "items/itemSelected";
export declare const itemChanged = "items/itemChanged";
export declare const loadItemRequested = "items/loadItem";
export declare const loadItemSucceeded = "items/loadItem-succeeded";
export declare const loadItemFailed = "items/loadItem-failed";
export declare const saveItemRequested = "items/saveItem";
export declare const saveItemSucceeded = "items/saveItem-succeeded";
export declare const saveItemFailed = "items/saveItem-failed";
export declare const deleteItemRequested = "items/deleteItem";
export declare const deleteItemSucceeded = "items/deleteItem-succeeded";
export declare const deleteItemFailed = "items/deleteItem-failed";
export declare type ItemTypeList = {
    [key in ItemType]: ItemType;
};
export declare const itemTypes: ItemTypeList;
export interface ItemsAction extends ActionInterface {
    payload?: {
        list?: Item[];
        item?: Item;
        category?: Category;
        change?: object;
        error?: Error;
    };
}
export interface ItemsThunkAction extends ThunkAction<any, RootState, unknown, ItemsAction> {
}
export interface ItemsState {
    list: Item[];
    selected: Item | EmptyObject;
    loading: boolean;
    savingSort: boolean;
    savingItem: boolean;
}
export declare const defaultItemState: ItemsState;
export declare const itemSort: (a: Item, b: Item) => number;
export declare const selectItemList: (state: RootState) => Item[];
export declare const selectItemById: (id: number) => (state: RootState) => Item;
export declare const selectCurrentItem: (state: RootState) => Item;
export declare const selectItemsLoading: (state: RootState) => boolean;
export declare const selectSortSaving: (state: RootState) => boolean;
export declare const selectItemSaving: (state: RootState) => boolean;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    list: Item[];
    selected: Item;
    loading: boolean;
    savingItem: boolean;
    savingSort: boolean;
}>, ItemsAction>;
export default _default;
