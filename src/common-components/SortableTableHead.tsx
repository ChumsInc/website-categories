import React from "react";
import SortableTH, {SortableTableField} from "./SortableTH";


export interface SortableTableHeadProps {
    fields: SortableTableField[],
    sortField: string,
    sortAsc: boolean,
    onChangeSort: (field: string, asc: boolean) => void,
}

const SortableTableHead:React.FC<SortableTableHeadProps> = ({fields, sortField, sortAsc, onChangeSort}) => {
    return (
        <thead>
            <tr>
                {fields.map((field, index) => (
                    <SortableTH key={index} field={field} sorted={sortField === field.field} ascending={sortAsc} onClick={onChangeSort} />
                ))}
            </tr>
        </thead>
    )
}
export default SortableTableHead;
