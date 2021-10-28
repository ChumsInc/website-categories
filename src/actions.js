import {
    CATEGORIES_ITEM_URL,
    CATEGORIES_URL,
    CATEGORY_DELETE_ITEM_URL,
    CATEGORY_SAVE_ITEM_URL,
    CATEGORY_SAVE_SORT_URL,
    CREATE_NEW_ITEM,
    DELETE_CATEGORY,
    DELETE_CATEGORY_ITEM,
    DISMISS_ALERT,
    FETCH_CATEGORIES,
    FETCH_CATEGORY,
    FETCH_CATEGORY_ITEM,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_KEYWORDS,
    FETCH_SUCCESS,
    NEW_ITEM,
    SAVE_CATEGORY,
    SAVE_CATEGORY_ITEM,
    SAVE_CATEGORY_ITEM_SORT,
    SELECT_CATEGORY,
    SELECT_CATEGORY_ITEM,
    SET_ALERT,
    SET_SITE,
    SET_TAB,
    SORT_ITEMS,
    UPDATE_CATEGORY,
    UPDATE_CATEGORY_ITEM,
    URL_KEYWORDS
} from "./constants";
import {buildPath, fetchJSON} from "chums-ducks";

export const handleError = (err) => {
    console.log(err.message);
    return setAlert({type: 'danger', title: err.name, message: err.message});
};

export const setAlert = ({type = 'warning', title = 'Oops!', message = 'There was an error'}) => ({
    type: SET_ALERT,
    alert: {type, title, message}
});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});


export const setTab = (tab) => ({type: SET_TAB, tab});
