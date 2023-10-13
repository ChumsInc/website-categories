import {selectCategoriesLoading,} from "./selectors";
import {RootState} from "../../app/configureStore";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductCategory} from "b2b-types";
import {fetchCategories, fetchCategory, postCategory} from "../../api/categories";
import {SortProps} from "chums-components";

export const toggleShowInactive = createAction<boolean | undefined>('categories/toggleShowInactive')
export const setFilter = createAction<string>('categories/setFilter');
export const updateCategory = createAction<Partial<ProductCategory>>('categories/current/update');
export const newCategory = createAction('categories/current/new');
export const setCategoriesSort = createAction<SortProps<ProductCategory>>('categories/setSort')

export const loadCategories = createAsyncThunk<ProductCategory[]>(
    'categories/list/load',
    async () => {
        return await fetchCategories();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCategoriesLoading(state);
        }
    }
)

export const loadCategory = createAsyncThunk<ProductCategory | null, ProductCategory>(
    'categories/current/load',
    async (arg) => {
        return await fetchCategory(arg.id);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectCategoriesLoading(state);
        }
    }
)

export const saveCategory = createAsyncThunk<ProductCategory | null, ProductCategory>(
    'categories/current/save',
    async (arg) => {
        return await postCategory(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.keyword && !selectCategoriesLoading(state)
        }
    }
)

