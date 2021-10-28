import {Action, AnyAction, combineReducers} from "redux";
import {ActionInterface, Category, defaultCategory, Keyword, SorterProps} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {AlertAction, pagedDataSelector, sortableTableSelector} from "chums-ducks";
import {calcChildIds, calcParentIds} from "./utils";

export const showInactiveToggled = 'categories/showInactiveToggled';
export const categoryFilterChanged = 'categories/categoryFilterChanged';
export const loadCategories = 'categories/load-requested';
export const loadCategoriesSucceeded = 'categories/load-succeeded';
export const loadCategoriesFailed = 'categories/load-failed';
export const categorySortChanged = 'categories/categorySortChanged';
export const categorySelected = 'categories/categorySelected';
export const categoryChanged = 'categories/selectedChanged';
export const saveCategory = 'categories/save-requested';
export const saveCategorySucceeded = 'categories/save-succeeded';
export const saveCategoryFailed = 'categories/save-failed';

export type CategorySortField = 'id' | 'keyword' | 'title' | 'parentId' | 'changefreq';

export interface CategoryAction extends ActionInterface {
    payload?: {
        list?: Category[],
        category?: Category,
        filter?: string,
        sort?: string,
        error?: Error,
        change?: object
    }
}

export const defaultCategorySort:SorterProps = {field: 'keyword', ascending: true};

export interface CategoryThunkAction extends ThunkAction<any, RootState, unknown, CategoryAction | AlertAction> {
}

export const categoriesURL = (site:string) => {
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

export const selectShowInactive = (state: RootState):boolean => state.categories.showInactive;

export const selectCategoryFilter = (state: RootState) => state.categories.filter;

export const selectCategoriesLoading = (state: RootState) => state.categories.loading;

export const selectCategoryList = (sort:SorterProps) => (state: RootState):Category[] => {
    return state.categories.list.sort(categorySorter(sort));
}

export const selectFilteredList = (sort: SorterProps) => (state: RootState):Category[] => {
    const {showInactive, filter, list} = state.categories;
    let filterRegex = /^/;
    let filterIDRegex = /^/;
    try {
        filterRegex = new RegExp(filter);
        filterIDRegex = new RegExp(`^${filter}$`)
    } catch (err) {
    }

    return list.filter(category => showInactive || !!category.status)
        .filter(category => !filter
            || filterRegex.test(category.keyword)
            || filterRegex.test(category.title)
            || filterIDRegex.test(String(category.id))
            || filterIDRegex.test(String(category.parentId))
        )
        .sort(categorySorter(sort));
}

export const pagedFilteredListSelector = (tableKey: string) => (state:RootState):Category[] => {
    const {field, ascending} = sortableTableSelector(tableKey)(state);
    const list = selectFilteredList({field, ascending})(state);
    return pagedDataSelector(tableKey, list)(state);
}

export const selectCurrentCategory = (state:RootState):Category => state.categories.selected;

export const childCategoriesSelector = (state:RootState):number[] => calcChildIds(state.categories.list, state.categories.selected.id);

export const disallowedParentsSelector = (state:RootState):number[] => calcParentIds(state.categories.list, state.categories.selected.id);

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
    case categoryFilterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: CategoryAction) => {
    switch (action.type) {
    case loadCategories:
        return true;
    case loadCategoriesSucceeded:
    case loadCategoriesFailed:
        return false;
    default:
        return state;
    }
}

const listReducer = (state: Category[] = [], action: CategoryAction) => {
    const {type, payload} = action;
    switch (type) {
    case loadCategoriesSucceeded:
        if (!payload?.list && !!payload?.category) {
            return [
                ...state.filter(cat => cat.id !== payload?.category?.id),
                {...payload?.category}
            ].sort(categorySorter(defaultCategorySort))
        }
        return [
            ...(payload?.list || []).sort(categorySorter(defaultCategorySort))
        ];
    default:
        return state;
    }
}

const selectedReducer = (state: Category = {...defaultCategory}, action:CategoryAction):Category => {
    const {type, payload} = action;
    switch (type) {
    case categorySelected:
        if (payload?.category) {
            if (!payload.category.children) {
                payload.category.children = [];
            }
            return {...payload?.category};
        }
        return {...defaultCategory};
    case categoryChanged:
        return {...state, ...payload?.change, changed: true};
    case loadCategoriesSucceeded:
        if (payload?.category?.id === state.id) {
            return payload?.category;
        }
        return state;
    case saveCategorySucceeded:
        if (payload?.category) {
            return {...payload?.category};
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
    selected: selectedReducer,
})
