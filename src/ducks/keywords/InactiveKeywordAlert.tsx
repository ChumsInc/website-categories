import React from 'react';
import {useSelector} from 'react-redux';
import {Alert} from "chums-ducks/dist/ducks";
import {keywordIdSelector, keywordSelector} from "./index";
import {ItemType, Keyword} from "../types";


interface InactiveAlertProps {
    keyword?: string,
    id?: number,
    itemType?:ItemType,
}

const InactiveKeywordAlert:React.FC<InactiveAlertProps> = ({keyword, id, itemType}) => {
    let kw:Keyword;
    if (keyword) {
        [kw] = useSelector(keywordSelector(keyword));
    } else if (!!id && !!itemType) {
        [kw] = useSelector(keywordIdSelector(id, itemType))
    } else {
        return null;
    }
    if (kw.status === 0) {
        return <Alert color="warning" title="Warning">'{kw.title}' is inactive.</Alert>
    }
    return null;

}

export default InactiveKeywordAlert
