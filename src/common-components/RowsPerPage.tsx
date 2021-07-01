import React, {ChangeEvent, memo} from 'react';

export const defaultPageValues:number[] = [10, 25, 50, 100, 250, 500, 1000];
export interface Props {
    value: number,
    pageValues?: number[],
    onChange: (value:number) => void,
}

const RowsPerPage: React.FC<Props> = ({value, pageValues = defaultPageValues, onChange }) => {
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => onChange(Number(ev.target.value));

    return (
        <select value={String(value)} onChange={changeHandler} className="form-select form-select-sm">
            {pageValues.map(value => (
                <option key={String(value)} value={String(value)}>{value}</option>
            ))}
        </select>
    )
}
export default memo(RowsPerPage)
