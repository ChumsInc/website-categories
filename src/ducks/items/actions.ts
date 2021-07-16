import {
    CATEGORIES_ITEM_URL,
    CATEGORY_DELETE_ITEM_URL,
    CATEGORY_SAVE_ITEM_URL,
    CATEGORY_SAVE_SORT_URL,
    CREATE_NEW_ITEM,
    DELETE_CATEGORY_ITEM,
    FETCH_CATEGORY_ITEM,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS, NEW_ITEM,
    SAVE_CATEGORY_ITEM,
    SAVE_CATEGORY_ITEM_SORT,
    SELECT_CATEGORY_ITEM,
    SORT_ITEMS,
    UPDATE_CATEGORY_ITEM
} from "../../constants";
import {buildPath, fetchDELETE, fetchGET, fetchPOST} from "../../fetch";
import {defaultItem, Item} from "../types";
import {
    deleteItemFailed,
    deleteItemRequested, deleteItemSucceeded,
    itemChanged,
    itemListSelector,
    itemLoadingSelector,
    ItemsAction,
    itemSelected,
    itemSortSaveFailed,
    itemSortSaveRequested,
    itemSortSaveSucceeded,
    ItemsThunkAction,
    loadItemFailed,
    loadItemRequested,
    loadItemSucceeded,
    saveItemFailed,
    saveItemRequested,
    saveItemSucceeded,
    savingItemSelector,
    savingSortSelector,
    selectedItemSelector
} from "./index";
import {loadingSelector, selectedCategorySelector} from "../categories";
import {currentSiteSelector} from "../sites";


interface URLInterface {
    [site: string]: {
        fetchItems: string,
        saveItem: string,
        saveSort: string,
        deleteItem: string,
    }
}

const URL: URLInterface = {
    b2b: {
        fetchItems: '/api/b2b/products/category/:parentId/items/:id(\\d+)?',
        saveItem: '/api/b2b/products/category/item',
        saveSort: '/api/b2b/products/category/:parentId(\\d+)/sort',
        deleteItem: '/api/b2b/products/category/:parentId(\\d+)/item/:id(\\d+)',
    },
    safety: {
        fetchItems: '/node-safety/products/category/:parentId/items/:id(\\d+)?',
        saveItem: '/node-safety/products/category/item',
        saveSort: '/node-safety/products/category/:parentId(\\d+)/sort',
        deleteItem: '/node-safety/products/category/item/:id(\\d+)',
    }
}

export const categoryItemsURL = (siteName: string) => {
    switch (siteName) {
    case 'safety':
        return '/node-safety/products/category/:parentId/items/:id(\\d+)?';
    default:
        return '/api/b2b/products/category/:parentId/items/:id(\\d+)?';
    }
}

const saveCategoryItemURL = (siteName: string) => {
    switch (siteName) {
    case 'safety':
        return '/node-safety/products/category/item';
    default:
        return '/api/b2b/products/category/item';
    }
}

const saveSortItemsURL = (siteName: string) => {
    switch (siteName) {
    case 'safety':
        return '/node-safety/products/category/:parentId(\\d+)/sort';
    default:
        return '/api/b2b/products/category/:parentId(\\d+)/sort';
    }
}

interface SortItemProps {
    dragIndex: number,
    hoverIndex: number
}

export const selectItemAction = (item: Item): ItemsThunkAction => (dispatch, getState) => {
    dispatch({type: itemSelected, payload: {item}});
    dispatch(fetchItemAction(item.id));
};

export const fetchItemAction = (id: number): ItemsThunkAction => async (dispatch, getState) => {
    try {
        if (!id) {
            return;
        }
        const state = getState();
        const site = currentSiteSelector(state);
        const category = selectedCategorySelector(state);
        if (loadingSelector(state) || itemLoadingSelector(state)) {
            return;
        }
        dispatch({type: loadItemRequested});
        const url = buildPath(URL[site.name].fetchItems, {parentId: category.id, id});
        const {categoryItems} = await fetchGET(url);
        const [item] = categoryItems;
        dispatch({type: loadItemSucceeded, payload: {item}});
    } catch (err) {
        console.log("()", err.message);
        dispatch({type: loadItemFailed, payload: {error: err, context: loadItemRequested}});
    }
}

export const saveItemSortAction = (items: Item[]): ItemsThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        if (loadingSelector(state) || itemLoadingSelector(state)) {
            return;
        }
        const site = currentSiteSelector(state);
        const {id: parentId} = selectedCategorySelector(state);
        const body = {
            items: items.map(({id, priority}) => ({id, priority}))
        };
        const url = buildPath(URL[site.name].saveSort, {parentId});

        dispatch({type: itemSortSaveRequested});
        const {categoryItems} = await fetchPOST(url, body);
        dispatch({type: itemSortSaveSucceeded, payload: {list: categoryItems}});
    } catch (err) {
        console.log("saveItemSortAction()", err.message);
        dispatch({type: itemSortSaveFailed, payload: {error: err, context: itemSortSaveRequested}});
    }
};

export const updateItemAction = (change: Object): ItemsAction => ({type: itemChanged, payload: {change}});


export const saveCategoryItemAction = (): ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state) || itemLoadingSelector(state) || savingSortSelector(state) || savingItemSelector(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const item = selectedItemSelector(state);
            item.parentId = selectedCategorySelector(state).id;
            if (item.id === 0) {
                item.priority = itemListSelector(state).length;
            }

            dispatch({type: saveItemRequested});
            const url = URL[site.name].saveItem;
            const {item: savedItem} = await fetchPOST(url, item);
            dispatch({type: saveItemSucceeded, payload: {item: savedItem}});
        } catch (err) {
            console.log("()", err.message);
            dispatch({type: saveItemFailed, payload: {error: err, context: saveItemRequested}});
        }
    };

export const deleteCategoryItemAction = (): ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (loadingSelector(state) || itemLoadingSelector(state) || savingSortSelector(state) || savingItemSelector(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const item = selectedItemSelector(state);
            if (!item.id) {
                return;
            }
            dispatch({type: deleteItemRequested});
            const url = buildPath(URL[site.name].deleteItem, {id: item.id, parentId: item.parentId});
            const {items = []} = await fetchDELETE(url);
            dispatch({type: deleteItemSucceeded, payload: {list: items}});
        } catch (err) {
            console.log("deleteCategoryItemAction()", err.message);
            dispatch({type: deleteItemFailed, payload: {error: err, context: deleteItemRequested}});
        }
    };


export const createNewItemAction = (parentId: number) => ({type: itemSelected, payload: {item: {...defaultItem, parentId}}});

