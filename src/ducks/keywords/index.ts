import {Action, combineReducers} from "redux";
import {Keyword} from "../types";
import {ThunkAction} from 'redux-thunk';
import {RootState} from "../index";
import {AlertAction} from "../alerts";
import {siteSelected} from "../sites";

export const keywordsLoading = 'app:keywords:load-requested';
export const keywordsLoadingSucceeded = 'app:keywords:load-succeeded';
export const keywordsLoadingFailed = 'app:keywords:load-failed';

export interface KeywordAction extends Action {
    payload: {
        list?: Keyword[],
    }
}

export interface KeywordThunkAction extends ThunkAction<any, RootState, unknown, KeywordAction|AlertAction> {}

export const listSelector = (state:RootState) => state.keywords.list;
export const filteredListSelector = (pagetype:string) => (state:RootState) => state.keywords.list.filter(kw => kw.pagetype === pagetype);
export const keywordSelector = (kw:string) => (state:RootState) => state.keywords.list.filter(keyword => keyword.keyword === kw);

const listReducer = (state:Keyword[] = [], action:KeywordAction) => {
    const {type, payload} = action;
    switch (type) {
    case siteSelected:
        return [];
    case keywordsLoadingSucceeded:
        return [...(payload.list || [])];
    default:
        return state;
    }
}

const loadingReducer = (state:boolean = false, action:KeywordAction) => {
    switch (action.type) {
    case keywordsLoading:
        return true;
    case keywordsLoadingSucceeded:
    case keywordsLoadingFailed:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
})
