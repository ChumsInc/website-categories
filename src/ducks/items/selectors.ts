import {RootState} from "../../app/configureStore";

export const selectItemList = (state: RootState) => state.items.list;
export const selectCurrentItem = (state: RootState) => state.items.current.item;
export const selectItemsLoading = (state: RootState) => state.items.loading;
export const selectSortSaving = (state: RootState) => state.items.savingSort;
export const selectItemSaving = (state: RootState) => state.items.current.saving;
