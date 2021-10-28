import React, {ChangeEvent} from 'react';
import SiteSelect from "../sites/SiteSelect";
import {FormCheck, Input, Progress, ProgressBar} from "chums-ducks/dist/components";
import {useDispatch, useSelector} from "react-redux";
import {selectCategoryFilter, selectCategoriesLoading, selectShowInactive,} from "./index";
import {loadCategoriesAction, setFilter, toggleShowInactiveAction} from "./actions";
import {SpinnerButton, ToggleButton} from "chums-ducks";

const CategoryListFilter: React.FC = () => {
    const dispatch = useDispatch();

    const filter = useSelector(selectCategoryFilter);
    const showInactive = useSelector(selectShowInactive);
    const loading = useSelector(selectCategoriesLoading);
    const onToggleShowInactive = () => {
        dispatch(toggleShowInactiveAction());
    }
    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        console.log(ev);
        dispatch(setFilter(ev.target.value));
    }

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <SiteSelect/>
            </div>
            <div className="col-auto">
                <ToggleButton id="category-list--filter-inactive" size="sm"
                              color="secondary" checked={showInactive} onClick={onToggleShowInactive}>
                    Show Inactive
                </ToggleButton>
            </div>
            <div className="col-auto">
                <Input value={filter || ''} onChange={onChangeFilter} type="search"
                       placeholder="Filter Categories"/>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" size="sm" color="primary" spinning={loading}
                               onClick={() => dispatch(loadCategoriesAction())}>Reload
                </SpinnerButton>
            </div>
        </div>
    )
}

export default CategoryListFilter;
