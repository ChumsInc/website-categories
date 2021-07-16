import { ActionInterface, Keyword } from "../types";
import { ThunkAction } from 'redux-thunk';
import { RootState } from "../index";
import { AlertAction } from "chums-ducks";
export declare const keywordsLoading = "keywords/load-requested";
export declare const keywordsLoadingSucceeded = "keywords/load-succeeded";
export declare const keywordsLoadingFailed = "keywords/load-failed";
export interface KeywordAction extends ActionInterface {
    payload?: {
        list?: Keyword[];
    };
}
export interface KeywordThunkAction extends ThunkAction<any, RootState, unknown, KeywordAction | AlertAction> {
}
export declare const listSelector: (state: RootState) => Keyword[];
export declare const filteredListSelector: (pageType?: string | undefined) => (state: RootState) => Keyword[];
export declare const keywordSelector: (kw: string) => (state: RootState) => Keyword[];
export declare const keywordIdSelector: (id: number, itemType: string) => (state: RootState) => Keyword[];
export declare const loadKeywords: () => KeywordThunkAction;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    list: Keyword[];
    loading: boolean;
}>, KeywordAction>;
export default _default;
