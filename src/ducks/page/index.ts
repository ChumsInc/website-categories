import {AnyAction, combineReducers} from "redux";
import {RootStateOrAny} from "react-redux";

export const currentPageChanged = 'page/currentPageChanged';
export const rowsPerPageChanged = 'page/rowsPerPageChanged';

export interface PageAction extends AnyAction {
    payload: number,
    meta: string,
}

export const setPage = (page: number, root:string = 'app'): PageAction => ({type: `${root}/${currentPageChanged}`, payload: page, meta: root});
export const setRowsPerPage = (rowsPerPage: number, root:string = 'app'): PageAction => ({type: `${root}/${rowsPerPageChanged}`, payload: rowsPerPage, meta: root});

export interface PageState {
    current: number,
    rowsPerPage: number,
}

export const selectCurrentPage = (state: RootStateOrAny): number => state.page.current;
export const selectRowsPerPage = (state: RootStateOrAny): number => state.page.rowsPerPage;

const currentReducer = (state = 1, action: PageAction): number => {
    const {type, payload, meta} = action;
    switch (type) {
    case `${meta}/${currentPageChanged}`:
        return payload || 1;
    case `${meta}/${rowsPerPageChanged}`:
        return 1;
    default:
        return state;
    }
}

const rowsPerPageReducer = (state = 25, action: PageAction): number => {
    const {type, payload, meta} = action;
    switch (type) {
    case `${meta}/${rowsPerPageChanged}`:
        return payload;
    default:
        return state;
    }
}


export default combineReducers({
    current: currentReducer,
    rowsPerPage: rowsPerPageReducer,
});
