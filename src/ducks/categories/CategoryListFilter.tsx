import React, {ChangeEvent} from 'react';
import SiteSelect from "../sites/SiteSelect";
import {FormCheck, Input, Progress, ProgressBar} from "chums-ducks/dist/components";
import {useDispatch, useSelector} from "react-redux";
import {filterSelector, loadingSelector, showInactiveSelector,} from "./index";
import {loadCategoriesAction, setFilter, toggleShowInactive} from "./actions";

const CategoryListFilter: React.FC = () => {
    const dispatch = useDispatch();

    const filter = useSelector(filterSelector);
    const showInactive = useSelector(showInactiveSelector);
    const loading = useSelector(loadingSelector);
    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        console.log(ev);
        dispatch(setFilter(ev.target.value));
    }

    return (
        <>
            <div className="row g-3">
                <label className="col-auto form-label">Site</label>
                <div className="col-auto">
                    <SiteSelect/>
                </div>
                <div className="col-auto">
                    <FormCheck label="Show Inactive" inline={true} checked={showInactive}
                               onClick={() => dispatch(toggleShowInactive())} type="checkbox"/>
                </div>
                <div className="col-auto">
                    <Input value={filter || ''} onChange={onChangeFilter} wait={350} type="search"
                           placeholder="Filter Categories"/>
                </div>
            </div>
            <div className="row g-3 mt-1 align-items-center">
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-primary"
                            onClick={() => dispatch(loadCategoriesAction())}>Reload
                    </button>
                </div>
                <div className="col">
                    {loading && <Progress><ProgressBar striped/></Progress>}
                </div>
            </div>
        </>

    )
}

export default CategoryListFilter;
