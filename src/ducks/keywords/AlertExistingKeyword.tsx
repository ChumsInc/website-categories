import React from 'react';
import {Alert} from "chums-components";
import {selectKeywordByName} from "./index";
import {RootState, useAppSelector} from "../../app/configureStore";

export interface AlertExistingKeywordProps {
    keyword: string,
    id: number,
    pageType: string,
}

const AlertExistingKeyword = ({keyword, pageType, id}: AlertExistingKeywordProps) => {
    const existing = useAppSelector((state: RootState) => selectKeywordByName(state, keyword));
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
