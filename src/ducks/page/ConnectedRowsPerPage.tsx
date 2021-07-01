import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectRowsPerPage, setRowsPerPage} from "./index";
import {default as RowsPerPage} from "../../common-components/RowsPerPage";

export {default as RowsPerPage, defaultPageValues} from "../../common-components/RowsPerPage";

export interface Props {
    selector?: () => number,
    setter?: () => void,
    pageValues?: Number[]
}

const ConnectedRowsPerPage: React.FC<Props> = ({
                                                   selector,
                                                   setter,
                                                   pageValues = [10, 25, 50, 100, 250, 500, 1000]
                                               }) => {
    const _selector = selector ?? selectRowsPerPage;
    const _setter = setter ?? setRowsPerPage;
    const dispatch = useDispatch();
    const rowPerPage = useSelector(_selector);
    const changeHandler = (value: number) => dispatch(_setter(value));
    return (
        <RowsPerPage value={rowPerPage} onChange={changeHandler}/>
    )
}
export default ConnectedRowsPerPage;
