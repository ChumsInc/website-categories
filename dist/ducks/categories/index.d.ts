import { ActionInterface, Category, SorterProps } from "../types";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
import { AlertAction } from "chums-ducks";
export declare const showInactiveToggled = "categories/showInactiveToggled";
export declare const categoryFilterChanged = "categories/categoryFilterChanged";
export declare const loadCategories = "categories/load-requested";
export declare const loadCategoriesSucceeded = "categories/load-succeeded";
export declare const loadCategoriesFailed = "categories/load-failed";
export declare const categorySortChanged = "categories/categorySortChanged";
export declare const categorySelected = "categories/categorySelected";
export declare const categoryChanged = "categories/selectedChanged";
export declare const saveCategory = "categories/save-requested";
export declare const saveCategorySucceeded = "categories/save-succeeded";
export declare const saveCategoryFailed = "categories/save-failed";
export declare type CategorySortField = 'id' | 'keyword' | 'title' | 'parentId' | 'changefreq';
export interface CategoryAction extends ActionInterface {
    payload?: {
        list?: Category[];
        category?: Category;
        filter?: string;
        sort?: string;
        error?: Error;
        change?: object;
    };
}
export declare const defaultCategorySort: SorterProps;
export interface CategoryThunkAction extends ThunkAction<any, RootState, unknown, CategoryAction | AlertAction> {
}
export declare const categoriesURL: (site: string) => "/node-safety/products/category/:id(\\d+)?" | "/api/b2b/products/category/:id(\\d+)?";
export declare const categorySorter: ({ field, ascending }: SorterProps) => (a: any, b: any) => number;
export declare const selectShowInactive: (state: RootState) => boolean;
export declare const selectCategoryFilter: (state: RootState) => string;
export declare const selectCategoriesLoading: (state: RootState) => boolean;
export declare const selectCategoryList: (sort: SorterProps) => (state: RootState) => Category[];
export declare const selectFilteredList: (sort: SorterProps) => (state: RootState) => Category[];
export declare const pagedFilteredListSelector: (tableKey: string) => (state: RootState) => Category[];
export declare const selectCurrentCategory: (state: RootState) => Category;
export declare const childCategoriesSelector: (state: RootState) => number[];
export declare const disallowedParentsSelector: (state: RootState) => number[];
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    showInactive: boolean;
    filter: string;
    loading: boolean;
    list: Category[];
    selected: Category;
}>, CategoryAction>;
export default _default;
