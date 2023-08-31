import {Editable, ProductCategory} from "b2b-types";
import {SortProps} from "chums-components";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadCategories,
    loadCategory,
    saveCategory,
    setCategoriesSort,
    setFilter,
    toggleShowInactive,
    updateCategory
} from "./actions";
import {categorySorter} from "./utils";

export interface CategoriesState {
    list: ProductCategory[];
    filter: string;
    loading: boolean;
    showInactive: boolean;
    current: (ProductCategory & Editable) | null;
    sort: SortProps<ProductCategory>;
}

export const initialState: CategoriesState = {
    list: [],
    filter: '',
    loading: false,
    showInactive: false,
    current: null,
    sort: {field: 'id', ascending: true},
}


const categoriesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadCategories.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.list = [...action.payload].sort(categorySorter(initialState.sort));
            if (state.current && state.current.id !== 0) {
                const [current] = action.payload.filter(cat => cat.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(loadCategories.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadCategory.pending, (state, action) => {
            state.loading = true;
            state.current = action.meta.arg;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.current = action.payload;
            if (action.payload) {
                state.list = [
                    ...state.list.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(initialState.sort))
            }
        })
        .addCase(loadCategory.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveCategory.pending, (state) => {
            state.loading = true;
        })
        .addCase(saveCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.current = action.payload;
            if (action.payload) {
                state.list = [
                    ...state.list.filter(cat => cat.id !== action.payload?.id),
                    action.payload,
                ].sort(categorySorter(initialState.sort))
            }
        })
        .addCase(saveCategory.rejected, (state) => {
            state.loading = false;
        })
        .addCase(updateCategory, (state, action) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
        })
        .addCase(setFilter, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(setCategoriesSort, (state, action) => {
            state.sort = action.payload;
        })
})

export default categoriesReducer;



