import React, {ChangeEvent} from "react";
import {selectKeywordsByType} from "./index";
import {Keyword} from "b2b-types";
import {Select} from "chums-components";
import {useAppSelector} from "../../app/configureStore";

interface ProductSelectProps {
    value: number,
    required?: boolean,
    onChange: (keyword?: Keyword) => void,
}

const ProductSelect = ({value, required, onChange}: ProductSelectProps) => {
    const list = useAppSelector((state) => selectKeywordsByType(state, 'product'));

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const {value} = ev.target;
        if (!value) {
            return;
        }
        const [keyword] = list.filter(kw => kw.id === Number(value));
        onChange(keyword);
    }

    return (
        <Select bsSize="sm" onChange={changeHandler} value={value || ''} required={required}>
            <option value="">Select one</option>
            {list.map(kw => <option key={kw.keyword} value={kw.id}>{kw.keyword} - {kw.title}</option>)}
        </Select>
    )
}

export default ProductSelect;
