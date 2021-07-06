import {
    filterChanged,
    showInactiveToggled,
    CategoryAction,
    CategoryThunkAction,
    categoriesLoadingFailed,
    categoriesLoadingSucceeded,
    sortChanged,
    CategorySortField,
    categoriesURL,
    categoriesLoading,
    categorySelected, categoryChanged,
} from "./index";
import {Action} from "redux";
import {CATEGORIES_URL} from "../../constants";
import {buildPath, fetchGET} from "../../fetch";
import {currentSiteSelector} from "../sites";
import {RootState} from "../index";
import {Category, defaultCategory} from "../types";

export const toggleShowInactive = (): Action => ({type: showInactiveToggled});
export const setFilter = (filter: string): CategoryAction => ({type: filterChanged, payload: {filter}});
export const setSortField = (sort: CategorySortField): CategoryAction => ({type: sortChanged, payload: {sort}});

export const loadCategories = (): CategoryThunkAction => async (dispatch, getState) => {
    const state: RootState = getState() as RootState;
    const site = currentSiteSelector(state);
    try {
        dispatch({type: categoriesLoading, payload: {}});
        const url = buildPath(categoriesURL(site.name));
        const {categories = [] as Category[]} = await fetchGET(url, {cache: 'no-cache'});
        dispatch({type: categoriesLoadingSucceeded, payload: {list: categories}});
    } catch (err) {
        console.log("loadCategories()", err.message);
        dispatch({type: categoriesLoadingFailed, payload: {error: err}});
    }
}

export const selectCategoryAction = (category = defaultCategory) => ({type: categorySelected, payload: {category}});

export const changeCategoryAction = (category = defaultCategory) => ({type: categoryChanged, payload: {category}})
