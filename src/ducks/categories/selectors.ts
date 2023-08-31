import {RootState} from "../../app/configureStore";
import {createSelector} from "reselect";
import {calcChildIds, calcParentIds, categorySorter} from "./utils";

export const selectShowInactive = (state: RootState): boolean => state.categories.showInactive;
export const selectCategoryFilter = (state: RootState) => state.categories.filter;
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategoryList = (state: RootState) => state.categories.list;
export const selectCategorySort = (state: RootState) => state.categories.sort;

export const selectCategoryListCount = createSelector(
    [selectCategoryList, selectCategoryFilter, selectShowInactive], (list, filter, showInactive) => {
        let filterRegex = /^/;
        let filterIDRegex = /^/;
        try {
            filterRegex = new RegExp(filter);
            filterIDRegex = new RegExp(`^${filter}$`)
        } catch (err) {
        }

        return list.filter(category => showInactive || !!category.status)
            .filter(category => !filter
                || filterRegex.test(category.keyword)
                || filterRegex.test(category.title)
                || filterIDRegex.test(String(category.id))
                || filterIDRegex.test(String(category.parentId))
            ).length;
    })

export const selectFilteredList = createSelector(
    [selectCategoryList, selectCategoryFilter, selectShowInactive, selectCategorySort],
    (list, filter, showInactive, sort) => {
        let filterRegex = /^/;
        let filterIDRegex = /^/;
        try {
            filterRegex = new RegExp(filter);
            filterIDRegex = new RegExp(`^${filter}$`)
        } catch (err) {
        }

        return list
            .filter(category => showInactive || !!category.status)
            .filter(category => !filter
                || filterRegex.test(category.keyword)
                || filterRegex.test(category.title)
                || filterIDRegex.test(String(category.id))
                || filterIDRegex.test(String(category.parentId))
            ).sort(categorySorter(sort));
    })

export const selectCurrentCategory = (state: RootState) => state.categories.current;

export const selectChildCategories = createSelector(
    [selectCategoryList, selectCurrentCategory],
    (list, current) => {
        return calcChildIds(list, current?.id);
    }
)

export const selectDisallowedParents = createSelector(
    [selectCategoryList, selectCurrentCategory],
    (list, current) => {
        return calcParentIds(list, current?.id);
    }
)

