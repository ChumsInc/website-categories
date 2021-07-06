import React, {ChangeEvent} from 'react';
import {useSelector} from 'react-redux';
import Select from "../../common-components/Select";
import classNames from 'classnames';
import {listSelector, categorySorter, selectedCategorySelector} from "./index";

const keywordSortProps = {field: 'keyword', ascending: true};
const keywordSort = categorySorter(keywordSortProps);

export interface CategorySelectProps {
    value: number | string,
    disallow: number[],
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => any,
    required?: boolean,
    disabled?: boolean,
}

const CategorySelect: React.FC<CategorySelectProps> = ({value, disallow = [], required, disabled, onChange}) => {
    const categories = useSelector(listSelector(keywordSortProps));
    return (
        <Select value={value} onChange={onChange} required={required} disabled={disabled}>
            <option value="">Select One</option>
            <option value={0}>-- none --</option>
            {categories
                .map(cat => (
                    <option value={cat.id} key={cat.id} className={classNames({inactive: cat.status === 0})}
                            disabled={disallow.includes(cat.id)}>
                        {cat.keyword}
                    </option>
                ))
            }
        </Select>
    )
}

export default CategorySelect;
