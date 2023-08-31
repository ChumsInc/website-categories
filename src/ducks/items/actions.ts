import {selectItemSaving, selectItemsLoading, selectSortSaving} from "./selectors";
import {deleteItem, fetchItem, postItem, postItemSort, PostItemSortArg} from "../../api/items";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {ProductCategoryChild} from "b2b-types";
import {CategoryItem} from "../types";

export const setCurrentItem = createAsyncThunk<ProductCategoryChild | null, CategoryItem>(
    'items/loadCurrent',
    async (arg) => {
        if (!arg.id) {
            return arg as ProductCategoryChild;
        }
        return await fetchItem(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectItemsLoading(state);
        }
    }
)

export const saveItemSort = createAsyncThunk<ProductCategoryChild[], PostItemSortArg>(
    'items/saveSort',
    async (arg) => {
        return await postItemSort(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.parentId && !!arg.items.length && !selectSortSaving(state)
        }
    }
)

export type UpdateItemProps = Partial<Omit <ProductCategoryChild, 'category'|'product'>>
/**
 * Note: when updating the itemType property, all fields that require changes must be submitted at the same time.
 * For example: dispatch(updateCurrentItem({itemType: 'category', }))
 */
export const updateCurrentItem = createAction<UpdateItemProps>('items/current/update');

export const saveCurrentItem = createAsyncThunk<ProductCategoryChild | null, CategoryItem>(
    'items/current/save',
    async (arg) => {
        return await postItem(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSortSaving(state) && !selectItemSaving(state);
        }
    }
)


export const deleteCurrentItem = createAsyncThunk<ProductCategoryChild[], CategoryItem>(
    'items/delete',
    async (arg) => {
        return await deleteItem(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !selectSortSaving(state) && !selectItemSaving(state);
        }
    }
)
