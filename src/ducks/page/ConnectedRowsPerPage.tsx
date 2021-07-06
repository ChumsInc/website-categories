import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {rowsPerPageSelector, setRowsPerPageAction} from "./index";
import {default as RowsPerPage} from "../../common-components/RowsPerPage";

export {default as RowsPerPage, defaultPageValues} from "../../common-components/RowsPerPage";

export interface ConnectedRowsPerPageProps {
    pageKey?: string,
    pageValues?: Number[]
}

const ConnectedRowsPerPage: React.FC<ConnectedRowsPerPageProps> = ({
                                                                       pageKey = 'app',
                                                                       pageValues = [10, 25, 50, 100, 250, 500, 1000]
                                                                   }) => {
    const dispatch = useDispatch();
    const rowPerPage = useSelector(rowsPerPageSelector(pageKey));
    const changeHandler = (value: number) => dispatch(setRowsPerPageAction({key: pageKey, rowsPerPage: value}));
    return (
        <RowsPerPage value={rowPerPage} onChange={changeHandler}/>
    )
}
export default ConnectedRowsPerPage;
