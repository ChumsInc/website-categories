import React, {ChangeEvent} from 'react';
import SiteSelect from "../sites/SiteSelect";
import FormCheck from "../../common-components/FormCheck";
import {useDispatch, useSelector} from "react-redux";
import {filterSelector, filteredListSelector, showInactiveSelector,} from "./index";
import Input from "../../common-components/Input";
import {setFilter, loadCategories, toggleShowInactive} from "./actions";

const CategoryListFilter: React.FC = () => {
    const dispatch = useDispatch();

    const list = useSelector(filteredListSelector);
    const filter = useSelector(filterSelector);
    const showInactive = useSelector(showInactiveSelector);
    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilter(ev.target.value));
    }
    return (
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
                <Input value={filter || ''} onChange={onChangeFilter}/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-primary"
                        onClick={() => dispatch(loadCategories())}>Reload
                </button>
            </div>
        </div>

    )
}

export default CategoryListFilter;
