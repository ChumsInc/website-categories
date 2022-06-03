import {combineReducers} from "redux";
import {ActionInterface, Keyword} from "../types";
import {ThunkAction} from 'redux-thunk';
import {RootState} from "../index";
import {AlertAction, buildPath, fetchJSON} from "chums-ducks";
import {Site, siteSelected} from "../sites";


export const keywordsLoading = 'keywords/load-requested';
export const keywordsLoadingSucceeded = 'keywords/load-succeeded';
export const keywordsLoadingFailed = 'keywords/load-failed';

export interface KeywordAction extends ActionInterface {
    payload?: {
        list?: Keyword[],
    }
}

export interface KeywordThunkAction extends ThunkAction<any, RootState, unknown, KeywordAction | AlertAction> {
}


export const listSelector = (state: RootState) => state.keywords.list;
export const filteredListSelector = (pageType?: string) => (state: RootState) => state.keywords.list.filter(kw => !pageType || kw.pagetype === pageType);
export const keywordSelector = (kw: string) => (state: RootState) => state.keywords.list.filter(keyword => keyword.keyword === kw);
export const keywordIdSelector = (id: number, itemType: string) => (state: RootState) =>
    state.keywords.list.filter(kw => kw.pagetype === itemType).filter(kw => kw.id === id);

const keywordURL = (site: Site) => {
    switch (site.name) {
    case 'safety':
        return '/node-safety/keywords';
    case 'b2b':
    default:
        return '/api/b2b/keywords';
    }
}

export const loadKeywordsAction = (): KeywordThunkAction => async (dispatch, getState) => {
    try {
        const {sites} = getState();
        dispatch({type: keywordsLoading});
        const url = buildPath(keywordURL(sites.selected));
        const {result} = await fetchJSON(url, {cache: "no-cache"});
        dispatch({type: keywordsLoadingSucceeded, payload: {list: result}});
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log("()", err.message);
            dispatch({type: keywordsLoadingFailed, payload: {error: err, context: keywordsLoading}});
        }
    }
};


const listReducer = (state: Keyword[] = [], action: KeywordAction) => {
    const {type, payload} = action;
    switch (type) {
    case siteSelected:
        return [];
    case keywordsLoadingSucceeded:
        return [...(payload?.list || [])];
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: KeywordAction) => {
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
