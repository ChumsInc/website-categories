import {RootState} from "../../app/configureStore";
import {ProductCategoryChild} from "b2b-types";

export const selectItemList = (state: RootState) => state.items.list;
export const selectItemById = (state: RootState, id: number) => {
    const [item] = state.items.list.filter(i => i.id === id);
    return item || null;
}
export const selectCurrentItem = (state: RootState) => state.items.current.item;
export const selectItemsLoading = (state: RootState) => state.items.loading;
export const selectSortSaving = (state: RootState) => state.items.savingSort;
export const selectItemSaving = (state: RootState) => state.items.current.saving;
