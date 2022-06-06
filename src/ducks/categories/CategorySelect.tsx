import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Select} from "chums-ducks/dist/components";
import classNames from 'classnames';
import {categorySorter, CategorySorterProps, defaultCategorySort, selectCategoryList} from "./index";
import {Category} from "../types";

const keywordSortProps: CategorySorterProps = {field: 'keyword', ascending: true};
const keywordSort = categorySorter(keywordSortProps);

export interface CategorySelectProps {
    value: number | string,
    disallow: number[],
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => any,
    required?: boolean,
    disabled?: boolean,
}

const CategorySelect: React.FC<CategorySelectProps> = ({value, disallow = [], required, disabled, onChange}) => {
    const categories = useSelector(selectCategoryList);
    const [list, setList] = useState<Category[]>([])
    useEffect(() => {
        const _list = categories.sort(categorySorter(defaultCategorySort));
        setList(_list);
    }, [categories]);

    return (
        <Select value={value} onChange={onChange} required={required} disabled={disabled} bsSize="sm">
            <option value="">Select One</option>
            <option value={0}>-- none --</option>
            {list
                .map(cat => (
                    <option value={cat.id} key={cat.id} className={classNames({inactive: !cat.status})}
                            disabled={disallow.includes(cat.id)}>
                        {cat.keyword}
                    </option>
                ))
            }
        </Select>
    )
}

export default React.memo(CategorySelect);
