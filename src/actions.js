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
import {buildPath, fetchDELETE, fetchGET, fetchPOST} from "./fetch";

export const handleError = (err) => {
    console.log(err.message);
    return setAlert({type: 'danger', title: err.name, message: err.message});
};

export const setAlert = ({type = 'warning', title = 'Oops!', message = 'There was an error'}) => ({
    type: SET_ALERT,
    alert: {type, title, message}
});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});

export const setSite = (site) => (dispatch, getState) => {
    dispatch({type: SET_SITE, site});
    dispatch(fetchCategories());
};

export const setTab = (tab) => ({type: SET_TAB, tab});

export const fetchCategories = () => (dispatch, getState) => {
    const {site, loading} = getState();
    if (loading) {
        return;
    }

    dispatch({type: FETCH_CATEGORIES, status: FETCH_INIT});
    const url = buildPath(CATEGORIES_URL, {site}, true);
    fetchGET(url)
        .then(({categories}) => {
            dispatch({type: FETCH_CATEGORIES, status: FETCH_SUCCESS, categories});
        })
        .catch(err => {
            dispatch({type: FETCH_CATEGORIES, status: FETCH_FAILURE, err});
        });
    dispatch(fetchKeywords());
};

export const fetchKeywords = () => (dispatch, getState) => {
    const {site} = getState();
    dispatch({type: FETCH_KEYWORDS, status: FETCH_INIT});
    const url = buildPath(URL_KEYWORDS, {site}, true);
    fetchGET(url)
        .then(({result}) => {
            dispatch({type: FETCH_KEYWORDS, status: FETCH_SUCCESS, keywords: result});
        })
        .catch(err => {
            dispatch({type: FETCH_KEYWORDS, status: FETCH_FAILURE, err});
        })
};

export const selectCategory = (category) => (dispatch, getState) => {
    const {site, loadingCategory} = getState();
    if (loadingCategory) {
        return;
    }
    dispatch({type: SELECT_CATEGORY, category});
    const {id = 0} = category;
    if (id === 0) {
        return;
    }

    dispatch({type: FETCH_CATEGORY, status: FETCH_INIT});
    const url = buildPath(CATEGORIES_URL, {site, id}, true);
    fetchGET(url)
        .then(res => {
            const [category = {}] = res.categories;
            const items = [...category.children];
            delete category.children;
            dispatch({type: FETCH_CATEGORY, status: FETCH_SUCCESS, category, items});
        })
        .catch(err => {
            dispatch({type: FETCH_CATEGORY, status: FETCH_FAILURE, err});
        });
};


export const updateCategory = (props) => ({type: UPDATE_CATEGORY, props});

export const saveCategory = () => (dispatch, getState) => {
    const {site, category} = getState();
    dispatch({type: SAVE_CATEGORY, status: FETCH_INIT});

    const url = buildPath(CATEGORIES_URL, {site});
    delete category.items;
    fetchPOST(url, category)
        .then(({category}) => {
            const items = [...category.children];
            delete category.children;
            dispatch({type: SAVE_CATEGORY, status: FETCH_SUCCESS, category, items});
        })
        .catch(err => {
            dispatch({type: SAVE_CATEGORY, status: FETCH_FAILURE, err});
        });
};

export const deleteCategory = () => (dispatch, getState) => {
    const {site, category, items} = getState();
    const {id} = category;
    if (items.length) {
        dispatch(setAlert({message: "You can't delete a category while it contains items"}));
        return;
    }
    if (id === 0) {
        return;
    }

    dispatch({type: DELETE_CATEGORY, status: FETCH_INIT});
    const url = buildPath(CATEGORIES_URL, {site, id});
    fetchDELETE(url)
        .then(res => {
            dispatch({type: DELETE_CATEGORY, status: FETCH_SUCCESS, id});
        })
        .catch(err => {
            dispatch({type: DELETE_CATEGORY, status: FETCH_FAILURE, err});
        });
};

export const updateItem = (props) => ({type: UPDATE_CATEGORY_ITEM, props});

export const sortItem = ({dragIndex, hoverIndex}) => (dispatch, getState) => {
    const {items} = getState();
    const movingItem = items[dragIndex];
    items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, movingItem);
    let priority = 0;
    items.forEach(item => item.priority = priority++);
    dispatch({type: SORT_ITEMS, items, hoverIndex, dragIndex});
};

export const selectItem = (item) => (dispatch, getState) => {
    const {site, category} = getState();
    const {id = 0} = item;
    dispatch({type: SELECT_CATEGORY_ITEM, item});
    if (id === 0) {
        return;
    }

    dispatch({type: FETCH_CATEGORY_ITEM, status: FETCH_INIT});
    const {id: parentId} = category;
    const url = buildPath(CATEGORIES_ITEM_URL, {site, parentId, id}, true);
    fetchGET(url)
        .then(({categoryItems = []}) => {
            const [item] = categoryItems[0] || {};
            dispatch({type: FETCH_CATEGORY_ITEM, status: FETCH_SUCCESS, item});
        })
        .catch(err => {
            dispatch({type: FETCH_CATEGORY_ITEM, status: FETCH_FAILURE, err});
        });
};

export const saveCategoryItem = () => (dispatch, getState) => {
    const {site, category, item, items} = getState();
    dispatch({type: SAVE_CATEGORY_ITEM, status: FETCH_INIT});

    const url = buildPath(CATEGORY_SAVE_ITEM_URL, {site, parentId: category.id});
    item.parentId = category.id;
    delete item.product;
    delete item.category;
    if (item.id === 0) {
        item.priority = items.length;
    }
    fetchPOST(url, item)
        .then(({item}) => {
            dispatch({type: SAVE_CATEGORY_ITEM, status: FETCH_SUCCESS, item});
        })
        .catch(err => {
            dispatch({type: SAVE_CATEGORY_ITEM, status: FETCH_FAILURE, err});
        });
};

export const deleteCategoryItem = () => (dispatch, getState) => {
    const {site, category, item} = getState();
    const {id} = item;
    const {id: parentId} = category;

    if (id === 0 || parentId === 0) {
        return;
    }

    dispatch({type: DELETE_CATEGORY_ITEM, status: FETCH_INIT});

    const url = buildPath(CATEGORY_DELETE_ITEM_URL, {site, id});
    fetchDELETE(url)
        .then(() => {
            dispatch({type: DELETE_CATEGORY_ITEM, status: FETCH_SUCCESS, id, parentId});
        })
        .catch(err => {
            dispatch({type: DELETE_CATEGORY_ITEM, status: FETCH_FAILURE, err});
        });
};

export const saveItemSort = () => (dispatch, getState) => {
    const {site, category, items} = getState();
    const {id: parentId} = category;
    const body = {
        items: items.map(({id, priority}) => ({id, priority}))
    };
    const url = buildPath(CATEGORY_SAVE_SORT_URL, {site, parentId});

    dispatch({type: SAVE_CATEGORY_ITEM_SORT, status: FETCH_INIT});
    fetchPOST(url, body)
        .then(({categoryItems: items}) => {
            dispatch({type: SAVE_CATEGORY_ITEM_SORT, status: FETCH_SUCCESS, items});
        })
        .catch(err => {
            dispatch({type: SAVE_CATEGORY_ITEM_SORT, status: FETCH_FAILURE, err});
        });
};

export const createNewItem = (parentId) => ({type: CREATE_NEW_ITEM, item: {...NEW_ITEM, parentId}});
