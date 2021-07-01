import {combineReducers} from 'redux';
import {
    CREATE_NEW_ITEM,
    DELETE_CATEGORY,
    DELETE_CATEGORY_ITEM,
    DISMISS_ALERT,
    FETCH_CATEGORIES,
    FETCH_CATEGORY,
    FETCH_CATEGORY_ITEM,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_KEYWORD,
    FETCH_KEYWORDS,
    FETCH_SUCCESS, LOCAL_STORE_RPP, LOCAL_STORE_SITE,
    NEW_CATEGORY,
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
    TABS,
    UPDATE_CATEGORY,
    UPDATE_CATEGORY_ITEM
} from "./constants";
import {now, LocalStore} from './utils';

const defaults = {};
defaults.rowsPerPage = LocalStore.getItem(LOCAL_STORE_RPP) || 10;
defaults.site = LocalStore.getItem(LOCAL_STORE_SITE) || 'b2b';


const site = (state = defaults.site, action) => {
    const {type, site} = action;
    switch (type) {
    case SET_SITE:
        LocalStore.setItem(LOCAL_STORE_SITE, site);
        return site;
    default:
        return state;
    }
};

const tab = (state = TABS.edit, action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
        return tab;
    default:
        return state;
    }
};

const categories = (state = [], action) => {
    const {type, status, categories, id, category} = action;
    switch (type) {
    case FETCH_CATEGORIES:
        return status === FETCH_SUCCESS ? [...categories] : state;
    case SAVE_CATEGORY:
        return status === FETCH_SUCCESS
            ? [...state.filter(cat => cat.id !== category.id), {...category}]
            : state;
    case DELETE_CATEGORY:
        return status === FETCH_SUCCESS ? state.filter(cat => cat.id !== id) : state;
    default:
        return state;
    }
};

const keywords = (state = [], action) => {
    const {type, status, keywords, keyword} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        return status === FETCH_SUCCESS ? [...keywords] : state;
    case FETCH_KEYWORD:
        return status === FETCH_SUCCESS ? [...state.filter(kw => kw.keyword !== keyword), {...keyword}] : state;
    default:
        return state;
    }
};

const category = (state = NEW_CATEGORY, action) => {
    const {type, category, props, status} = action;
    switch (type) {
    case SET_SITE:
        return NEW_CATEGORY;
    case SELECT_CATEGORY:
        return {...category};
    case FETCH_CATEGORY:
        return status === FETCH_SUCCESS ? {...category} : state;
    case UPDATE_CATEGORY:
        return {...state, ...props, changed: true};
    case DELETE_CATEGORY:
        return status === FETCH_SUCCESS ? NEW_CATEGORY : state;
    case SAVE_CATEGORY:
        return status === FETCH_SUCCESS
            ? {...category}
            : state;
    default:
        return state;
    }
};

const items = (state = [], action) => {
    const {type, status, items, item, id} = action;
    switch (type) {
    case SELECT_CATEGORY:
        return [];
    case FETCH_CATEGORY:
        return status === FETCH_SUCCESS
            ? [...items]
            : state;
    case SAVE_CATEGORY_ITEM_SORT:
        return status === FETCH_SUCCESS
            ? [...items]
            : state;
    case SAVE_CATEGORY_ITEM:
        return status === FETCH_SUCCESS
            ? [...state.filter(i => i.id !== item.id), item]
            : state;
    case DELETE_CATEGORY_ITEM:
        return status === FETCH_SUCCESS
            ? [...state.filter(i => i.id !== id)]
            : state;
    case SORT_ITEMS:
        return [...items];
    default:
        return state;
    }
};

const item = (state = NEW_ITEM, action) => {
    const {type, status, item, props, category, parentId} = action;
    switch (type) {
    case SET_SITE:
        return {...NEW_ITEM};
    case SELECT_CATEGORY:
    case FETCH_CATEGORY:
        return category
            ? {...NEW_ITEM, parentId: category.id, priority: (category.items || []).length}
            : {...NEW_ITEM};
    case FETCH_CATEGORY_ITEM:
        return status === FETCH_SUCCESS ? {...item} : state;
    case SELECT_CATEGORY_ITEM:
        return {...item};
    case UPDATE_CATEGORY_ITEM:
        return {...state, ...props, changed: true};
    case SAVE_CATEGORY_ITEM:
        return status === FETCH_SUCCESS ? {...NEW_ITEM, ...item} : state;
    case DELETE_CATEGORY_ITEM:
        return status === FETCH_SUCCESS ? {...NEW_ITEM, parentId} : state;
    case CREATE_NEW_ITEM:
        return {...item};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_CATEGORIES:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const loadingCategory = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_CATEGORY:
    case SAVE_CATEGORY:
    case SAVE_CATEGORY_ITEM_SORT:
    case DELETE_CATEGORY:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const loadingItem = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_CATEGORY_ITEM:
    case SAVE_CATEGORY_ITEM:
    case DELETE_CATEGORY_ITEM:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

export default {
    site,
    tab,
    categories,
    keywords,
    category,
    items,
    item,
    loading,
    loadingCategory,
    loadingItem,
};
