import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {filteredListSelector} from "./index";
import {Keyword} from "../types";
import Select from "../../common-components/Select";

interface KeywordSelectProps {
    pagetype: 'category'|'product'|'page',
    onChange: (keyword?:Keyword) => void,
}
const KeywordSelect:React.FC<KeywordSelectProps> = ({pagetype, onChange}) => {
    const list = useSelector(filteredListSelector(pagetype));

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const {value} = ev.target;
        const [keyword] = list.filter(kw => kw.keyword === value);
        onChange(keyword);
    }

    return (
        <Select bsSize="sm" onChange={changeHandler}>
            <option value="">Select one</option>
            {list.map(kw => <option key={kw.keyword} value={kw.keyword}>{kw.keyword}</option>)}
        </Select>
    )
}

export default KeywordSelect;
