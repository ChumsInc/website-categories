import {buildPath, fetchDELETE, fetchJSON, fetchPOST} from "chums-ducks";
import {defaultItem, Item} from "../types";
import {
    deleteItemFailed,
    deleteItemRequested,
    deleteItemSucceeded,
    itemChanged,
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
    selectCurrentItem,
    selectItemList,
    selectItemSaving,
    selectItemsLoading,
    selectSortSaving
} from "./index";
import {selectCategoriesLoading, selectCurrentCategory} from "../categories";
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
        const category = selectCurrentCategory(state);
        if (selectCategoriesLoading(state) || selectItemsLoading(state)) {
            return;
        }
        dispatch({type: loadItemRequested});
        const url = buildPath(URL[site.name].fetchItems, {parentId: category.id, id});
        const {categoryItems} = await fetchJSON(url, {cache: 'no-cache'});
        const [item] = categoryItems;
        dispatch({type: loadItemSucceeded, payload: {item}});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log("()", err.message);
            dispatch({type: loadItemFailed, payload: {error: err, context: loadItemRequested}});
        }
    }
}

export const saveItemSortAction = (items: Item[]): ItemsThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        if (selectCategoriesLoading(state) || selectItemsLoading(state)) {
            return;
        }
        const site = currentSiteSelector(state);
        const {id: parentId} = selectCurrentCategory(state);
        const body = {
            items: items.map(({id, priority}) => ({id, priority}))
        };
        const url = buildPath(URL[site.name].saveSort, {parentId});

        dispatch({type: itemSortSaveRequested});
        const {categoryItems} = await fetchPOST(url, body);
        dispatch({type: itemSortSaveSucceeded, payload: {list: categoryItems}});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log("saveItemSortAction()", err.message);
            dispatch({type: itemSortSaveFailed, payload: {error: err, context: itemSortSaveRequested}});
        }
    }
};

export const updateItemAction = (change: Object): ItemsAction => ({type: itemChanged, payload: {change}});


export const saveCategoryItemAction = (): ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCategoriesLoading(state) || selectItemsLoading(state) || selectSortSaving(state) || selectItemSaving(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const item = selectCurrentItem(state);
            item.parentId = selectCurrentCategory(state).id;
            if (item.id === 0) {
                item.priority = selectItemList(state).length;
            }

            dispatch({type: saveItemRequested});
            const url = URL[site.name].saveItem;
            const {item: savedItem} = await fetchPOST(url, item);
            dispatch({type: saveItemSucceeded, payload: {item: savedItem}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("()", err.message);
                dispatch({type: saveItemFailed, payload: {error: err, context: saveItemRequested}});
            }
        }
    };

export const deleteCategoryItemAction = (): ItemsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCategoriesLoading(state) || selectItemsLoading(state) || selectSortSaving(state) || selectItemSaving(state)) {
                return;
            }
            const site = currentSiteSelector(state);
            const item = selectCurrentItem(state);
            if (!item.id) {
                return;
            }
            dispatch({type: deleteItemRequested});
            const url = buildPath(URL[site.name].deleteItem, {id: item.id, parentId: item.parentId});
            const {items = []} = await fetchDELETE(url);
            dispatch({type: deleteItemSucceeded, payload: {list: items}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log("deleteCategoryItemAction()", err.message);
                dispatch({type: deleteItemFailed, payload: {error: err, context: deleteItemRequested}});
            }
        }
    };


export const createNewItemAction = (parentId: number) => ({
    type: itemSelected,
    payload: {item: {...defaultItem, parentId}}
});

