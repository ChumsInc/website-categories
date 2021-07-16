import {combineReducers} from 'redux';
import {alertsReducer, pagesReducer, tabsReducer, sortableTablesReducer, sitesReducer} from 'chums-ducks/dist/ducks';

import {default as keywordsReducer} from './keywords';
import {default as categoriesReducer} from './categories';
import {default as itemsReducer} from './items';
import {default as modalEditorReducer} from './modal-editor';


const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    tabs: tabsReducer,
    sites: sitesReducer,
    keywords: keywordsReducer,
    categories: categoriesReducer,
    items: itemsReducer,
    sortableTables: sortableTablesReducer,
    modalEditor: modalEditorReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;

