import React from 'react';
import {Alert} from "chums-components";
import {KeywordPageType, selectKeywordById, selectKeywordByName} from "./index";
import {useAppSelector} from "../../app/configureStore";


interface InactiveAlertProps {
    keyword?: string,
    id?: number,
    pageType?: KeywordPageType,
}

const InactiveIdKeywordAlert = ({id, pageType}: { id: number, pageType?: KeywordPageType }) => {
    const keyword = useAppSelector((state) => selectKeywordById(state, id, pageType));
    if (keyword && !keyword.status) {
        return <Alert color="warning" title="Warning">'{keyword.title}' is inactive.</Alert>
    }
    return null;
}

const InactiveNamedKeywordAlert = ({keyword}: { keyword: string }) => {
    const kw = useAppSelector((state) => selectKeywordByName(state, keyword));
    if (kw && !kw.status) {
        return <Alert color="warning" title="Warning">'{kw.title}' is inactive.</Alert>
    }
    return null;

}
const InactiveKeywordAlert = ({keyword, id, pageType}: InactiveAlertProps) => {
    if (keyword) {
        return (
            <InactiveNamedKeywordAlert keyword={keyword}/>
        )
    } else if (!!id && !!pageType) {
        return (
            <InactiveIdKeywordAlert id={id} pageType={pageType}/>
        )
    }
    return null;
}

export default InactiveKeywordAlert
