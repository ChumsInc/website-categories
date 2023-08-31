import {CategoryItem, EditableCategoryItem, ItemType} from '../types'
import {createReducer} from "@reduxjs/toolkit";
import {loadCategory} from "../categories/actions";
import {deleteCurrentItem, saveCurrentItem, saveItemSort, setCurrentItem, updateCurrentItem} from "./actions";


export interface ItemsState {
    list: CategoryItem[];
    current: {
        item: EditableCategoryItem | null;
        loading: boolean;
        saving: boolean;
    };
    loading: boolean;
    savingSort: boolean;
}

export type ItemTypeList = {
    [key in ItemType]: ItemType;
};
export const itemTypes: ItemTypeList = {
    product: 'product',
    category: 'category',
    section: 'section',
    link: 'link',
};


export const defaultItemState: ItemsState = {
    list: [],
    current: {
        item: null,
        loading: false,
        saving: false,
    },
    loading: false,
    savingSort: false,
}

export const itemSort = (a: CategoryItem, b: CategoryItem) => a.priority - b.priority;


const itemsReducer = createReducer(defaultItemState, builder => {
    builder
        .addCase(loadCategory.pending, (state, action) => {
            if (!state.current.item || state.current.item.parentId !== action.meta.arg.id) {
                state.list = [];
                state.current.item = null;
            }
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [...action.payload.children].sort(itemSort);
                const [item] = action.payload.children.filter(item => item.id === state.current.item?.id);
                state.current.item = item ?? null;
            }
        })
        .addCase(setCurrentItem.pending, (state, action) => {
            state.current.item = action.meta.arg;
            state.current.loading = true;
        })
        .addCase(setCurrentItem.fulfilled, (state, action) => {
            state.current.item = action.payload;
            state.current.loading = false;
        })
        .addCase(setCurrentItem.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(saveCurrentItem.pending, (state) => {
            state.current.saving = true;
        })
        .addCase(saveCurrentItem.fulfilled, (state, action) => {
            state.current.item = action.payload;
            state.current.saving = false;
        })
        .addCase(saveCurrentItem.rejected, (state) => {
            state.current.saving = false;
        })
        .addCase(deleteCurrentItem.pending, (state) => {
            state.current.saving = true;
        })
        .addCase(deleteCurrentItem.fulfilled, (state, action) => {
            state.list = [...action.payload].sort(itemSort)
            state.current.item = null;
            state.current.saving = false;
        })
        .addCase(deleteCurrentItem.rejected, (state) => {
            state.current.saving = false;
            state.current.item = null;
        })
        .addCase(saveItemSort.pending, (state) => {
            state.savingSort = true;
        })
        .addCase(saveItemSort.fulfilled, (state, action) => {
            state.savingSort = false;
            state.list = [...action.payload].sort(itemSort);
            if (state.current.item) {
                const [current] = action.payload.filter(item => item.id === state.current.item?.id);
                state.current.item = current;
            }
        })
        .addCase(saveItemSort.rejected, (state) => {
            state.savingSort = false;
        })
        .addCase(updateCurrentItem, (state, action) => {
            if (state.current.item) {
                state.current.item = {...state.current.item, ...action.payload, changed: true} as EditableCategoryItem;
            }
        })
});

export default itemsReducer;
