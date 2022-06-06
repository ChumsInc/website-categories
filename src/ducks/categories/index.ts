import {Action, AnyAction, combineReducers} from "redux";
import {ActionInterface, Category, defaultCategory, Keyword, SorterProps} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {
    ActionPayload,
    AlertAction, filterPage,
    pagedDataSelector,
    selectCurrentPage,
    selectRowsPerPage,
    sortableTableSelector
} from "chums-ducks";
import {calcChildIds, calcParentIds} from "./utils";
import {selectTableSort, SortableTableField} from "chums-ducks/dist/ducks";
import {createSelector} from "reselect";

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

export const TABLE_KEY = 'categories';

export type CategorySortField = 'id' | 'keyword' | 'title' | 'parentId' | 'changefreq';
export type SortableCategoryField = keyof Omit<Category, 'lifestyle'|'changed'|'css'|'children'|'status'>;

export interface CategoryListSortableField extends SortableTableField {
    field: SortableCategoryField
}

export interface CategoryPayload extends ActionPayload {
    list?: Category[],
    category?: Category,
    filter?: string,
    sort?: string,
    change?: object
}
export interface CategoryAction extends ActionInterface {
    payload?: CategoryPayload
}
export interface CategorySorterProps extends SorterProps {
    field: SortableCategoryField
}
export const defaultCategorySort:CategorySorterProps = {field: 'keyword', ascending: true};

export interface CategoryThunkAction extends ThunkAction<any, RootState, unknown, CategoryAction | AlertAction> {
}

export const categoriesURL = (site:string) => {
    switch (site) {
    case 'safety': return '/node-safety/products/category/:id(\\d+)?';
    default: return '/api/b2b/products/category/:id(\\d+)?';
    }
}

export const categorySorter = ({field, ascending}: CategorySorterProps) => (a: Category, b: Category) => {
    console.log('categorySorter', field, ascending);
    const ascMod = ascending ? 1 : -1;
    switch (field) {
    case "id":
    case 'priority':
    case "parentId":
        return (a[field] - b[field]) * ascMod;
    case 'timestamp':

    default:
        return (
            a[field] === b[field]
                ? (a.keyword > b.keyword ? 1 : -1)
                : a[field] > b[field] ? 1 : -1
        ) * ascMod;
    }
}

export const selectShowInactive = (state: RootState):boolean => state.categories.showInactive;

export const selectCategoryFilter = (state: RootState) => state.categories.filter;

export const selectCategoriesLoading = (state: RootState) => state.categories.loading;

export const selectCategoryList = (state:RootState) => state.categories.list;

export const selectCategoryListCount = createSelector(
    [selectCategoryList, selectCategoryFilter, selectShowInactive], (list, filter, showInactive) => {
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
            ).length;
    })

export const selectFilteredList = createSelector(
    [selectCategoryList, selectCategoryFilter, selectShowInactive, selectTableSort(TABLE_KEY), selectCurrentPage(TABLE_KEY), selectRowsPerPage(TABLE_KEY)],
    (list, filter, showInactive, sort, page, rowsPerPage) => {
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
            ).sort(categorySorter(sort as CategorySorterProps))
            .filter(filterPage(page, rowsPerPage));
})

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
