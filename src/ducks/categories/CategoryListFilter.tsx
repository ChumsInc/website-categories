import React, {ChangeEvent} from 'react';
import {Input, SpinnerButton, ToggleButton} from "chums-components";
import {useSelector} from "react-redux";
import {selectCategoriesLoading, selectCategoryFilter, selectShowInactive,} from "./selectors";
import {loadCategories, setFilter, toggleShowInactive} from "./actions";
import {loadKeywords} from "../keywords";
import {useAppDispatch} from "../../app/configureStore";

const CategoryListFilter: React.FC = () => {
    const dispatch = useAppDispatch();
    const filter = useSelector(selectCategoryFilter);
    const showInactive = useSelector(selectShowInactive);
    const loading = useSelector(selectCategoriesLoading);

    const onToggleShowInactive = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked));
    }

    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilter(ev.target.value));
    }

    const onReload = () => {
        dispatch(loadCategories());
        dispatch(loadKeywords())
    }

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <ToggleButton id="category-list--filter-inactive" size="sm"
                              color="warning" checked={showInactive} onChange={onToggleShowInactive}>
                    Show Inactive
                </ToggleButton>
            </div>
            <div className="col-auto">
                <Input value={filter || ''} onChange={onChangeFilter} type="search" bsSize="sm"
                       placeholder="Filter Categories"/>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" size="sm" color="primary" spinning={loading}
                               onClick={onReload}>
                    Reload
                </SpinnerButton>
            </div>
        </div>
    )
}

export default CategoryListFilter;
