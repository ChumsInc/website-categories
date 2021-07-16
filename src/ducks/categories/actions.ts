import {
    categoryFilterChanged,
    showInactiveToggled,
    CategoryAction,
    CategoryThunkAction,
    loadCategoriesFailed,
    loadCategoriesSucceeded,
    categorySortChanged,
    CategorySortField,
    categoriesURL,
    loadCategories,
    categorySelected,
    categoryChanged,
    saveCategory,
    loadingSelector,
    saveCategorySucceeded,
    saveCategoryFailed,
} from "./index";
import {Action} from "redux";
import {CATEGORIES_URL, FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS, SAVE_CATEGORY} from "../../constants";
import {buildPath, fetchGET, fetchPOST} from "../../fetch";
import {currentSiteSelector} from "../sites";
import {RootState} from "../index";
import {Category, defaultCategory} from "../types";

export const toggleShowInactive = (): Action => ({type: showInactiveToggled});
export const setFilter = (filter: string): CategoryAction => ({type: categoryFilterChanged, payload: {filter}});

export const loadCategoriesAction = (id?: number): CategoryThunkAction => async (dispatch, getState) => {
    const state: RootState = getState() as RootState;
    const site = currentSiteSelector(state);
    const loading = loadingSelector(state);
    if (loading) {
        return;
    }
    try {
        dispatch({type: loadCategories, payload: {}});
        const url = buildPath(categoriesURL(site.name), {id});
        const {categories = [] as Category[]} = await fetchGET(url, {cache: 'no-cache'});
        if (!!id && categories.length === 1) {
            const [category] = categories;
            return dispatch({type: loadCategoriesSucceeded, payload: {category}});
        }
        dispatch({type: loadCategoriesSucceeded, payload: {list: categories}});
    } catch (err) {
        console.log("loadCategoriesAction()", err.message);
        dispatch({type: loadCategoriesFailed, payload: {error: err}});
    }
}

export const selectCategoryAction = (category = defaultCategory): CategoryThunkAction =>
    async (dispatch, getState) => {
        dispatch({type: categorySelected, payload: {category}});
        if (category.id) {
            await dispatch(loadCategoriesAction(category.id))
        }
    }

export const changeCategoryAction = (change: Object = defaultCategory):CategoryAction => ({type: categoryChanged, payload: {change}})

export const saveCategoryAction = (category: Category): CategoryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const site = currentSiteSelector(state);
            const loading = loadingSelector(state);
            if (loading) {
                return;
            }
            dispatch({type: saveCategory});

            const url = buildPath(categoriesURL(site.name));
            delete category.children;
            const {category: savedCategory} = await fetchPOST(url, category);
            dispatch({type: saveCategorySucceeded, payload: {category: savedCategory}});
        } catch(err) {
            console.log("saveCategory()", err.message);
            dispatch({type: saveCategoryFailed, payload: {error: err, context: saveCategory}});

        }
    }
