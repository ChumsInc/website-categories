import React, {ReactElement} from "react";
import classNames from "classnames";

export interface SortableTableField {
    field: string,
    title: string,
    sortable: boolean,
    render?: (row:any) => ReactElement|Element|string,
    className?: string|object|((any:any) => string|object),
}

export interface SortableTHProps {
    field: SortableTableField,
    sorted?: boolean,
    ascending?: boolean
    onClick: (field: string, ascending: boolean) => void,
}

const SortableTH:React.FC<SortableTHProps> = ({field,sorted, ascending, onClick}) => {
    if (!field.sortable) {
        return (<th>{field.title}</th>)
    }
    const iconClassName = {
        'bi-sort-down': !!sorted && !!ascending,
        'bi-sort-up': !!sorted && !ascending,
    }
    const clickHandler = () => {
        onClick(field.field, !sorted ? true : !ascending);
    }

    return (
        <th className="sortable" onClick={clickHandler}>
            {field.title}
            {!!sorted && (
                <span className={classNames('ms-1', iconClassName)}/>
            )}
        </th>
    )
}

export default SortableTH;
