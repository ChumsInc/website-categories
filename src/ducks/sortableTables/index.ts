import {Action} from "redux";
import {RootState} from "../index";
import {SortableTable} from "../types";

export interface SortableTablesAction extends Action {
    payload: {
        key: string,
        field: string,
        ascending: boolean,
    }
}

export interface SortableTablesState {
    [key:string]: SortableTable
}

export const tablesSortChanged = 'app:tables:sortChanged';
export const tablesTableAdded = 'app:tables:tableAdded';

export const sortableTableSelector = (key:string) => (state:RootState):SortableTable => state.sortableTables[key] || {key, field: '', ascending: false};

export const sortChangedAction = ({key, field, ascending}:SortableTable):SortableTablesAction => ({
    type: tablesSortChanged,
    payload: {key, field, ascending}
});

export const tableAddedAction = ({key, field, ascending}:SortableTable):SortableTablesAction => ({
    type: tablesTableAdded,
    payload: {key, field, ascending}
})

const sortableTablesReducer = (state:SortableTablesState = {}, action:SortableTablesAction):SortableTablesState => {
    const {type, payload} = action;
    const {key, field, ascending} = payload || {};
    switch (type) {
    case tablesSortChanged:
        return {
            ...state,
            [key]: {key, field, ascending}
        }
    case tablesTableAdded:
        if (!state[key]) {
            return {
                ...state,
                [key]: {key, field, ascending}
            }
        }
        return state;
    default: return state;
    }
}

export default sortableTablesReducer;
