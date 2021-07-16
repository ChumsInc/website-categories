import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {filteredListSelector} from "./index";
import {Keyword} from "../types";
import Select from "chums-ducks/dist/components/Select";

interface ProductSelectProps {
    value: number,
    required?: boolean,
    onChange: (keyword?:Keyword) => void,
}
const ProductSelect:React.FC<ProductSelectProps> = ({value, required, onChange}) => {
    const list = useSelector(filteredListSelector('product'));

    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
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
