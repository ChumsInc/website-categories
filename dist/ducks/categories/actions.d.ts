import { CategoryAction, CategoryThunkAction } from "./index";
import { Action } from "redux";
import { Category } from "../types";
export declare const toggleShowInactive: () => Action;
export declare const setFilter: (filter: string) => CategoryAction;
export declare const loadCategoriesAction: (id?: number | undefined) => CategoryThunkAction;
export declare const selectCategoryAction: (category?: Category) => CategoryThunkAction;
export declare const changeCategoryAction: (change?: Object) => CategoryAction;
export declare const saveCategoryAction: (category: Category) => CategoryThunkAction;
