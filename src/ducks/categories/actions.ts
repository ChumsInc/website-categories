import {
    categoriesURL,
    CategoryAction,
    categoryChanged,
    categoryFilterChanged,
    categorySelected,
    CategoryThunkAction,
    loadCategories,
    loadCategoriesFailed,
    loadCategoriesSucceeded,
    selectCategoriesLoading,
    saveCategory,
    saveCategoryFailed,
    saveCategorySucceeded,
    showInactiveToggled,
} from "./index";
import {Action} from "redux";
import {currentSiteSelector} from "../sites";
import {RootState} from "../index";
import {Category, defaultCategory} from "../types";
import {buildPath, fetchJSON} from "chums-ducks";

export const toggleShowInactiveAction = (): CategoryAction => ({type: showInactiveToggled});
export const setFilter = (filter: string): CategoryAction => ({type: categoryFilterChanged, payload: {filter}});

export const loadCategoriesAction = (id?: number): CategoryThunkAction =>
    async (dispatch, getState) => {
        const state: RootState = getState() as RootState;
        const site = currentSiteSelector(state);
        const loading = selectCategoriesLoading(state);
        if (loading) {
            return;
        }
        try {
            dispatch({type: loadCategories, payload: {}});
            const url = buildPath(categoriesURL(site.name), {id});
            const {categories = [] as Category[]} = await fetchJSON(url, {cache: 'no-cache'});
            if (!!id && categories.length === 1) {
                const [category] = categories;
                return dispatch({type: loadCategoriesSucceeded, payload: {category}});
            }
            dispatch({type: loadCategoriesSucceeded, payload: {list: categories}});
        } catch (err:unknown) {
            if (err instanceof Error) {
                console.log("loadCategoriesAction()", err.message);
                dispatch({type: loadCategoriesFailed, payload: {error: err}});
            }
        }
    }

export const selectCategoryAction = (category = defaultCategory): CategoryThunkAction =>
    async (dispatch, getState) => {
        dispatch({type: categorySelected, payload: {category}});
        if (category.id) {
            await dispatch(loadCategoriesAction(category.id))
        }
    }

export const changeCategoryAction = (change: Object = defaultCategory): CategoryAction => ({
    type: categoryChanged,
    payload: {change}
})

const getCategoryBody = (category:Category):string => {
    const {children, ...rest} = category;
    return JSON.stringify(rest);
}

export const saveCategoryAction = (category: Category): CategoryThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const site = currentSiteSelector(state);
            const loading = selectCategoriesLoading(state);
            if (loading) {
                return;
            }
            dispatch({type: saveCategory});

            const url = buildPath(categoriesURL(site.name));
            const body = getCategoryBody(category);
            const {category: savedCategory} = await fetchJSON(url, {method: 'POST', body});
            dispatch({type: saveCategorySucceeded, payload: {category: savedCategory}});
        } catch (err:unknown) {
            if (err instanceof Error) {
                console.log("saveCategory()", err.message);
                dispatch({type: saveCategoryFailed, payload: {error: err, context: saveCategory}});
            }
        }
    }
