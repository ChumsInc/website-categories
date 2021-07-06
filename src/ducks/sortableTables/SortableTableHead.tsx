import React from "react";
import SortableTH, {SortableTableField} from "./SortableTH";
import {useSelector} from "react-redux";
import {sortableTableSelector} from "./index";


export interface SortableTableHeadProps {
    tableKey: string,
    fields: SortableTableField[],
    onChangeSort: (field: string, asc: boolean) => void,
}

const SortableTableHead:React.FC<SortableTableHeadProps> = ({tableKey, fields, onChangeSort}) => {
    const {field, ascending} = useSelector(sortableTableSelector(tableKey));
    return (
        <thead>
            <tr>
                {fields.map((tableField, index) => (
                    <SortableTH key={index} field={tableField} sorted={field === tableField.field} ascending={ascending} onClick={onChangeSort} />
                ))}
            </tr>
        </thead>
    )
}
export default SortableTableHead;
