import React, {ChangeEvent} from "react";
import {KeywordPageType, selectKeywordsByType} from "./index";
import {Select} from "chums-components";
import {Keyword} from "b2b-types";
import {useAppSelector} from "../../app/configureStore";

interface KeywordSelectProps {
    pageType?: KeywordPageType,
    value: string,
    onChange: (keyword?: Keyword) => void,
}

const KeywordSelect = ({pageType, value, onChange}: KeywordSelectProps) => {
    const list = useAppSelector((state) => selectKeywordsByType(state, pageType));

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const {value} = ev.target;
        const [keyword] = list.filter(kw => kw.keyword === value);
        onChange(keyword);
    }

    return (
        <Select bsSize="sm" onChange={changeHandler} value={value || ''}>
            <option value="">Select one</option>
            {list.map(kw => <option key={kw.keyword} value={kw.keyword}>{kw.keyword}</option>)}
        </Select>
    )
}

export default KeywordSelect;
