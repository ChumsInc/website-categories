import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {currentPageSelector, rowsPerPageSelector, setPageAction} from "./index";
import {default as Pagination, calcPages, filterPage} from "../../common-components/Pagination";

export {default as Pagination, filterPage, calcPages} from '../../common-components/Pagination';

export interface Props {
    pageKey?: string,
    dataLength: number,
    filtered?: boolean,
    className?: string | object,
    maxButtons?: number,
}

const ConnectedPagination: React.FC<Props> = ({
                                                  pageKey= 'app',
                                                  dataLength,
                                                  ...props
                                              }) => {

    const dispatch = useDispatch();
    const page = useSelector(currentPageSelector(pageKey));
    const rowsPerPage = useSelector(rowsPerPageSelector(pageKey));
    const pages = calcPages(dataLength, rowsPerPage) || 1;
    if (page > pages) {
        dispatch(setPageAction({key: pageKey, current: 1}));
    }
    const changeHandler = (value: number) => dispatch(setPageAction({key: pageKey, current: value}));

    return (
        <Pagination page={page} pages={pages} onSelectPage={changeHandler} {...props}/>
    )
}
export default ConnectedPagination;
