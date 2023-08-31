import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Select} from "chums-components";
import classNames from 'classnames';
import {selectCategoryList} from "./selectors";
import {ProductCategory} from "b2b-types";
import {categorySorter} from "./utils";

export interface CategorySelectProps {
    value: number | string,
    disallow: number[],
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => any,
    required?: boolean,
    disabled?: boolean,
}

const CategorySelect = ({value, disallow = [], required, disabled, onChange}: CategorySelectProps) => {
    const categories = useSelector(selectCategoryList);
    const [list, setList] = useState<ProductCategory[]>([])

    useEffect(() => {
        const list = [...categories].sort(categorySorter({field: 'keyword', ascending: true}));
        setList(list);
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

export default CategorySelect;
