import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import alertsReducer from "../ducks/alerts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import categoriesReducer from "../ducks/categories";
import itemsReducer from "../ducks/items";
import keywordsReducer from "../ducks/keywords";
import usageReducer from "../ducks/usage";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    categories: categoriesReducer,
    items: itemsReducer,
    keywords: keywordsReducer,
    usage: usageReducer,
})


const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
