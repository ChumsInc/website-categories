import {Keyword} from 'b2b-types'
import {RootState} from "../../app/configureStore";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchKeywords} from "../../api/keywords";
import {createSelector} from "reselect";


export interface KeywordsState {
    list: Keyword[];
    loading: boolean;
}

const initialState: KeywordsState = {
    list: [],
    loading: false,
}

export type KeywordPageType = 'category'|'product'|'page';

export const sortByKeyword = (a:Keyword, b:Keyword) => {
    return a.keyword > b.keyword ? 1 : -1;
}
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;

export const selectKeywords = (state:RootState) => state.keywords.list;

export const selectKeywordByName = (state: RootState, kw: string) => {
    const [keyword] = state.keywords.list.filter(keyword => keyword.keyword === kw);
    return keyword ?? null;
}

export const selectKeywordsByType = createSelector(
    [selectKeywords, (state, pageType?: KeywordPageType) => pageType],
    (list, pageType) => {
        return list
            .filter(kw => !pageType || kw.pagetype === pageType)
            .sort(sortByKeyword);

    })
export const selectKeywordById = createSelector(
    [selectKeywords, (state, id: number, pageType?:KeywordPageType) => ({id, pageType})],
    (list, arg) => {
        const [kw] = list.filter(kw => !arg.pageType || kw.pagetype === arg.pageType )
            .filter(kw => kw.id === arg.id);
        return kw ?? null;
    }
)

export const loadKeywords = createAsyncThunk<Keyword[]>(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeywordsLoading(state);
        }
    }
)

const keywordsReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadKeywords.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadKeywords.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.sort((a, b) => a.id - b.id);
        })
        .addCase(loadKeywords.rejected, (state, action) => {
            state.loading = false;
        })
})

export default keywordsReducer;
