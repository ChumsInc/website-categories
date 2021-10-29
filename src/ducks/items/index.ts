import {ActionInterface, Category, defaultItem, Item, ItemType} from '../types'
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {EmptyObject, combineReducers} from "redux";
import {CategoryAction, categorySelected, loadCategoriesSucceeded} from "../categories";

export const itemsSortChanged = 'items/sortChanged';
export const itemSortSaveRequested = 'items/saveSort';
export const itemSortSaveSucceeded = 'items/saveSort-failed';
export const itemSortSaveFailed = 'items/saveSort-failed';
export const itemSelected = 'items/itemSelected';
export const itemChanged = 'items/itemChanged';
export const loadItemRequested = 'items/loadItem';
export const loadItemSucceeded = 'items/loadItem-succeeded';
export const loadItemFailed = 'items/loadItem-failed';
export const saveItemRequested = 'items/saveItem';
export const saveItemSucceeded = 'items/saveItem-succeeded';
export const saveItemFailed = 'items/saveItem-failed';
export const deleteItemRequested = 'items/deleteItem';
export const deleteItemSucceeded = 'items/deleteItem-succeeded';
export const deleteItemFailed = 'items/deleteItem-failed';

export type ItemTypeList = {
    [key in ItemType]: ItemType;
};
export const itemTypes:ItemTypeList = {
    product: 'product',
    category: 'category',
    section: 'section',
    link: 'link',
    html: 'html',
};


export interface ItemsAction extends ActionInterface {
    payload?: {
        list?: Item[],
        item?: Item,
        category?: Category, // implemented by CategoryAction
        change?: object,
        error?: Error
    }
}
export interface ItemsThunkAction extends ThunkAction<any, RootState, unknown, ItemsAction> {}

export interface ItemsState {
    list: Item[],
    selected: Item|EmptyObject,
    loading: boolean,
    savingSort: boolean,
    savingItem: boolean,
}

export const defaultItemState:ItemsState = {
    list: [],
    selected: {},
    loading: false,
    savingSort: false,
    savingItem: false,
}

export const itemSort = (a:Item, b:Item) => a.priority - b.priority;

export const selectItemList = (state:RootState):Item[] => state.items.list;
export const selectItemById = (id:number) => (state:RootState):Item => {
    const [item] = state.items.list.filter(i => i.id === id);
    return item || {};
}
export const selectCurrentItem = (state:RootState):Item => state.items.selected;
export const selectItemsLoading = (state:RootState) => state.items.loading;
export const selectSortSaving = (state:RootState) => state.items.savingSort;
export const selectItemSaving = (state:RootState) => state.items.savingItem;

const listReducer = (state:Item[] = [], action:ItemsAction):Item[] => {
    const {type, payload} = action;
    switch (type) {
    case loadCategoriesSucceeded:
        if (payload?.category) {
            return (payload.category.children || []).sort(itemSort)
        }
        return state;
    case itemSortSaveSucceeded:
    case deleteItemSucceeded:
        if (payload?.list) {
            return payload.list.sort(itemSort);
        }
        return state;
    case loadItemSucceeded:
    case saveItemSucceeded:
        if (payload?.item) {
            const {item} = payload;
            return [
                ...state.filter(i => i.id !== item.id),
                item,
            ].sort(itemSort);
        }
        return state;
    default: return state;
    }
}

const selectedItemReducer = (state:Item = {...defaultItem}, action:ItemsAction): Item => {
    const {type, payload} = action;
    switch (type) {
    case itemSelected:
    case loadItemSucceeded:
    case saveItemSucceeded:
        return payload?.item || {...defaultItem};
    case itemSortSaveSucceeded:
        if (state.id && payload?.list) {
            const [item] = payload.list.filter(i => i.id === state.id);
            return {...item};
        }
        return state;
    case deleteItemSucceeded:
        return {...defaultItem};

    case categorySelected:
        return {
            ...defaultItem,
            parentId: payload?.category?.id || 0,
        }
    case itemChanged:
        if (payload?.change) {
            return {
                ...state,
                ...payload.change,
                changed: true,
            }
        }
        return state;
    default: return state;
    }
}

const savingSortReducer = (state:boolean = false, action:ItemsAction): boolean => {
    switch (action.type) {
    case itemSortSaveRequested:
        return true;
    case itemSortSaveSucceeded:
    case itemSortSaveFailed:
        return false;
    default: return state;
    }
}

const loadingReducer = (state:boolean = false, action:ItemsAction):boolean => {
    switch (action.type) {
    case loadItemRequested:
        return true;
    case loadItemSucceeded:
    case loadItemFailed:
        return false;
    default: return state;
    }
}

const savingItemReducer = (state: boolean = false, action: ItemsAction):boolean => {
    switch (action.type) {
    case saveItemRequested:
        return true;
    case saveItemSucceeded:
    case saveItemFailed:
        return false;
    default: return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedItemReducer,
    loading: loadingReducer,
    savingItem: savingItemReducer,
    savingSort: savingSortReducer,
})
