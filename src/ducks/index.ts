import {combineReducers} from 'redux';

import {default as alertsReducer, } from './alerts';
import {default as pageReducer} from './page';
import {default as tabsReducer} from './tabs';
import {default as siteReducer} from './sites';
import {default as keywordsReducer} from './keywords';
import {default as categoriesReducer} from './categories';
import {default as sortableTablesReducer} from './sortableTables';
import oldReducers from '../reducers';


const rootReducer = combineReducers({
    ...oldReducers,
    alerts: alertsReducer,
    page: pageReducer,
    tabs: tabsReducer,
    sites: siteReducer,
    keywords: keywordsReducer,
    categories: categoriesReducer,
    sortableTables: sortableTablesReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;

