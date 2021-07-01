import {
    filterChanged,
    showInactiveToggled,
    CategoryAction,
    CategoryThunkAction,
    categoriesLoadingFailed, categoriesLoadingSucceeded, sortChanged, CategorySortField
} from "./index";
import {Action} from "redux";
import {CATEGORIES_URL} from "../../constants";
import {buildPath, fetchGET} from "../../fetch";
import {currentSiteSelector} from "../sites";
import {RootState} from "../index";

export const toggleShowInactive = (): Action => ({type: showInactiveToggled});
export const setFilter = (filter: string): CategoryAction => ({type: filterChanged, payload: {filter}});
export const setSortField = (sort: CategorySortField): CategoryAction => ({type: sortChanged, payload: {sort}});

export const loadCategories = (): CategoryThunkAction => async (dispatch, getState) => {
    const state: RootState = getState() as RootState;
    const site = currentSiteSelector(state);
    try {
        const url = buildPath(CATEGORIES_URL, {site});
        const {categories = []} = await fetchGET(url, {cache: 'no-cache'});
        dispatch({type: categoriesLoadingSucceeded, payload: {list: categories}});
    } catch (err) {
        console.log("loadCategories()", err.message);
        dispatch({type: categoriesLoadingFailed, payload: {error: err}});
    }
}
