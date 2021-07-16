import React from 'react';
import {useSelector} from 'react-redux';
import {Alert} from "chums-ducks/dist/ducks";
import {keywordSelector} from "./index";

export interface AlertExistingKeywordProps {
    keyword: string,
    id: number,
    pageType: string,
}
const AlertExistingKeyword:React.FC<AlertExistingKeywordProps> = ({keyword, pageType, id}) => {
    const [existing] = useSelector(keywordSelector(keyword));
    if (!existing) {
        return null;
    }
    if (existing.pagetype === pageType && existing.id === id) {
        return null;
    }
    return (
        <Alert color="warning" title="Warning">
            {existing.pagetype} '{existing.keyword}' already exists.
        </Alert>
    )
}

export default AlertExistingKeyword;
