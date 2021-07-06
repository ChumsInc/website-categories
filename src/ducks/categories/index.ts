import {Action, combineReducers} from "redux";
import {Category, defaultCategory, Keyword, SorterProps} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {AlertAction} from "../alerts";
import {sortableTableSelector} from "../sortableTables";
import {pagedDataSelector} from "../page";
import {calcChildIds} from "./utils";

export const showInactiveToggled = 'app:categories:showInactiveToggled';
export const filterChanged = 'app:categories:filterChanged';
export const categoriesLoading = 'app:categories:load-requested';
export const categoriesLoadingSucceeded = 'app:categories:load-succeeded';
export const categoriesLoadingFailed = 'app:categories:load-failed';
export const sortChanged = 'app:categories:sortChanged';
export const categorySelected = 'app:categories:categorySelected';
export const categoryChanged = 'app:categories:selectedChanged';

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

export const categoriesURL = (site:string, id?:number) => {
    switch (site) {
    case 'safety': return '/node-safety/products/category/:id(\\d+)?';
    default: return '/api/b2b/products/category/:id(\\d+)?';
    }
}

export const categorySorter = ({field, ascending}: SorterProps) => (a: any, b: any) => {
    if (field in a && field in b) {
        return (
            a[field] === b[field]
                ? (a.keyword > b.keyword ? 1 : -1)
                : a[field] > b[field] ? 1 : -1
        ) * (ascending ? 1 : -1);
    }
    return 0;
}

export const showInactiveSelector = (state: RootState):boolean => state.categories.showInactive;

export const filterSelector = (state: RootState) => state.categories.filter;

export const loadingSelector = (state: RootState) => state.categories.loading;

export const listSelector = (sort:SorterProps) => (state: RootState):Category[] => {
    return state.categories.list.sort(categorySorter(sort));
}

export const filteredListSelector = (sort: SorterProps) => (state: RootState):Category[] => {
    const {showInactive, filter, list} = state.categories;
    let filterRegex = /^/;
    try {
        filterRegex = new RegExp(filter);
    } catch (err) {
    }

    return list.filter(category => showInactive || !!category.status)
        .filter(category => !filter || filterRegex.test(category.keyword) || filterRegex.test(category.title))
        .sort(categorySorter(sort));
}

export const pagedFilteredListSelector = (tableKey: string) => (state:RootState):Category[] => {
    const {field, ascending} = sortableTableSelector(tableKey)(state);
    const list = filteredListSelector({field, ascending})(state);
    return pagedDataSelector(tableKey, list)(state);
}

export const selectedCategorySelector = (state:RootState):Category => state.categories.selected;

export const childCategoriesSelector = (state:RootState):number[] => calcChildIds(state.categories.list, state.categories.selected.id);

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
        return [
            ...(payload.list || []).sort(categorySorter({field: 'keyword', ascending: true}))
        ];
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

const selectedReducer = (state: Category = {...defaultCategory}, action:CategoryAction) => {
    const {type, payload} = action;
    switch (type) {
    case categorySelected:
        if (!payload.category) {
            return {...defaultCategory};
        }
        return {...payload.category};
    case categoryChanged:
        if (!payload.category) {
            return {...defaultCategory};
        }
        return {...payload.category, changed: true};
    case categoriesLoadingSucceeded:
        if (state.keyword) {
            const {keyword} = state;
            const [category] = (payload.list || []).filter(cat => cat.keyword === keyword);
            return category || {...defaultCategory};
        }
        return state;
    default:
        return state;
    }
}

export default combineReducers({
    showInactive: showInactiveReducer,
    filter: filterReducer,
    loading: loadingReducer,
    list: listReducer,
    sort: sortReducer,
    selected: selectedReducer,
})
