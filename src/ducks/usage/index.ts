import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchUsage} from "../../api/usage";
import {RootState} from "../../app/configureStore";

export interface CategoryUsage {
    categorypage_id: number;
    page_keyword: string;
    page_title: string;
    item_title: string;
    item_status: boolean;
}

export interface ProductUsage {
    categorypage_id: number;
    page_keyword: string;
    page_title: string;
    item_title: string;
    item_status: boolean;
    products_keyword: string;
    products_status: boolean;
}

export interface KeywordUsage {
    products: ProductUsage[];
    categories: CategoryUsage[];
    loading: boolean;
    timestamp: number;
}

export interface UsageResponse {
    products: ProductUsage[];
    categories: CategoryUsage[];
    timestamp?: number;
}


export interface KeywordUsageList {
    [key: string]: KeywordUsage;
}

export interface UsageState {
    keywords: KeywordUsageList;
}

export const initialState: UsageState = {
    keywords: {},
}

export const selectUsageByKeyword = (state: RootState, keyword?: string) => {
    if (!keyword) {
        return null;
    }
    return  state.usage.keywords[keyword] ?? null;
}

export const loadUsage = createAsyncThunk<UsageResponse, string|undefined>(
    'usage/load',
    async (arg) => {
        const usage = await fetchUsage(arg!);
        usage.timestamp = new Date().valueOf();
        return usage;
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectUsageByKeyword(state, arg)?.loading;
        }
    }
)

const usageReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadUsage.pending, (state, action) => {
            if (!state.keywords[action.meta.arg!]) {
                state.keywords[action.meta.arg!] = {
                    products: [],
                    categories: [],
                    loading: true,
                    timestamp: 0,
                }
            }
            state.keywords[action.meta.arg!].loading = true;
        })
        .addCase(loadUsage.fulfilled, (state, action) => {
            state.keywords[action.meta.arg!] = {
                products: action.payload.products ?? [],
                categories: action.payload.categories ?? [],
                loading: false,
                timestamp: action.payload.timestamp ?? 0,
            }
        })
        .addCase(loadUsage.rejected, (state, action) => {
            state.keywords[action.meta.arg!].loading = false;
        })
});

export default usageReducer
