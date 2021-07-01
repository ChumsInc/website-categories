import {Action, combineReducers} from "redux";
import {Category, Keyword} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {AlertAction} from "../alerts";
import {SortableTable} from "../sortableTables";

export const showInactiveToggled = 'app:categories:showInactiveToggled';
export const filterChanged = 'app:categories:filterChanged';
export const categoriesLoading = 'app:categories:load-requested';
export const categoriesLoadingSucceeded = 'app:categories:load-succeeded';
export const categoriesLoadingFailed = 'app:categories:load-failed';
export const sortChanged = 'app:categories:sortChanged';

export type CategorySortField = 'id' | 'keyword' | 'title' | 'parentId' | 'changefreq';

export interface CategoryAction extends Action {
    payload: {
        list?: Category[],
        category?: Category,
        filter?: string,
        sort?: string,
        error?: Error,
    }
}

export interface CategoryThunkAction extends ThunkAction<any, RootState, unknown, CategoryAction | AlertAction> {
}

export const categorySorter = ({field, ascending}: SortableTable) => (a: any, b: any) => {
    if (field in a && field in b) {
        return (
            a[field] === b[field]
                ? (a.keyword > b.keyword ? 1 : -1)
                : a[field] > b[field] ? 1 : -1
        ) * (ascending ? 1 : -1);
    }
    return 0;
}


export const showInactiveSelector = (state: RootState) => state.categories.showInactive;

export const filterSelector = (state: RootState) => state.categories.filter;

export const loadingSelector = (state: RootState) => state.categories.loading;

export const listSelector = (state: RootState) => state.categories.list;

export const filteredListSelector = (sort: SortableTable) => (state: RootState) => {
    const {showInactive, filter, list} = state.categories;
    let filterRegex = /^/;
    try {
        filterRegex = new RegExp(filter);
    } catch (err) {
    }
    return list.filter(category => showInactive || !!category.status)
        .filter(category => !!filter || filterRegex.test(category.keyword) || filterRegex.test(category.title))
        .sort(categorySorter(sort));
}

const showInactiveReducer = (state: boolean = false, action: CategoryAction) => {
    switch (action.type) {
    case showInactiveToggled:
        return !state;
    default:
        return state;
    }
}

const filterReducer = (state: string = '', action: CategoryAction) => {
    const {type, payload} = action;
    switch (type) {
    case filterChanged:
        return payload.filter || '';
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: CategoryAction) => {
    switch (action.type) {
    case categoriesLoading:
        return true;
    case categoriesLoadingSucceeded:
    case categoriesLoadingFailed:
        return false;
    default:
        return state;
    }
}

const listReducer = (state: Category[] = [], action: CategoryAction) => {
    const {type, payload} = action;
    switch (type) {
    case categoriesLoadingSucceeded:
        return [...(payload.list || [])];
    default:
        return state;
    }
}

const sortReducer = (state: CategorySortField = 'keyword', action: CategoryAction) => {
    const {type, payload} = action;
    switch (type) {
    case sortChanged:
        return payload?.sort ?? 'keyword';
    default:
        return state;
    }
}

export default combineReducers({
    showInactive: showInactiveReducer,
    filter: filterReducer,
    loading: loadingReducer,
    list: listReducer,
    sort: sortReducer
})
