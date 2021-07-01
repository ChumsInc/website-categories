import React from 'react';
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {selectCurrentPage, selectRowsPerPage, setPage} from "./index";
import {default as Pagination, calcPages, filterPage} from "../../common-components/Pagination";
export {default as Pagination, filterPage, calcPages} from '../../common-components/Pagination';

export interface Props {
    dataLength: number,
    selector?: (state: RootStateOrAny) => number,
    pageSelector?: (state: RootStateOrAny) => number,
    setter?: (page: number) => any,
    filtered?: boolean,
    className?: string | object,
    maxButtons?: number,
}

const ConnectedPagination: React.FC<Props> = ({
                                                   dataLength,
                                                   selector,
                                                   pageSelector,
                                                   setter,
                                                   ...props
                                               }) => {
    const _setter = setter ?? setPage;
    const dispatch = useDispatch();

    const page = useSelector(pageSelector ?? selectCurrentPage);
    const rowsPerPage = useSelector(selector ?? selectRowsPerPage);
    const pages = calcPages(dataLength, rowsPerPage) || 1;
    if (page > pages) {
        dispatch(_setter(1));
    }
    const changeHandler = (value: number) => dispatch(_setter(value));

    return (
        <Pagination page={page} pages={pages} onSelectPage={changeHandler} {...props}/>
    )
}
export default ConnectedPagination;
