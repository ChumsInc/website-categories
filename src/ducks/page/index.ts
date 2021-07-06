import {AnyAction, combineReducers} from "redux";
import {RootStateOrAny} from "react-redux";
import {RootState} from "../index";

export const addPageSet = 'page/addPageSet';
export const currentPageChanged = 'page/currentPageChanged';
export const rowsPerPageChanged = 'page/rowsPerPageChanged';

export interface PageSetAction {
    key: string,
    current?: number,
    rowsPerPage?: number,
}

export interface PageAction extends AnyAction {
    payload: PageSetAction
}

export const setPageAction = ({current, key = 'app'}:PageSetAction): PageAction => ({type: currentPageChanged, payload: {key, current}});
export const setRowsPerPageAction = ({rowsPerPage, key = 'app'}:PageSetAction): PageAction => ({type: rowsPerPageChanged, payload: {key, rowsPerPage}});
export const addPageSetAction = ({key = 'app', current = 1, rowsPerPage = 25}:PageSetAction): PageAction => ({type: addPageSet, payload: {key, current, rowsPerPage}});

export interface KeyedPageState {
    current: number,
    rowsPerPage: number,
}
export interface PageState {
    [key:string] : KeyedPageState
}

export const currentPageSelector = (key:string) => (state: RootState): number => state.page[key]?.current ?? 1;
export const rowsPerPageSelector = (key:string) => (state: RootState): number => state.page[key]?.rowsPerPage ?? 25;
export const pagedDataSelector = (key: string, data: any[]) => (state:RootState):any[] => {
    const {current, rowsPerPage} = state.page[key] || {};
    return data.filter((row, index) => Math.ceil((index + 1) / rowsPerPage) === current);
}

const pageReducer = (state:PageState = {}, action: PageAction):PageState => {
    const {type, payload} = action;
    const {key = 'app', current = 1, rowsPerPage = 25} = payload || {};
    switch (type) {
    case currentPageChanged:
        if (state[key]) {
            const {rowsPerPage} = state[key];
            return {
                ...state,
                [key]: {current, rowsPerPage}
            }
        }
        return state;
    case rowsPerPageChanged:
        if (state[key]) {
            const {current} = state[key];
            return {
                ...state,
                [key]: {current, rowsPerPage}
            }
        }
        return state;
    case addPageSet:
        return {
            ...state,
            [key]: {current, rowsPerPage},
        }
    default: return state;
    }
}

export default pageReducer
