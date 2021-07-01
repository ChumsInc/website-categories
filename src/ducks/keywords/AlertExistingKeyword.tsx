import React, {Component} from 'react';
import PropTypes, {string} from 'prop-types';
import {connect, useSelector} from 'react-redux';
import Alert from "../../common-components/Alert";
import {keywordSelector} from "./index";

export interface AlertExistingKeywordProps {
    keyword: string
}
const AlertExistingKeyword:React.FC<AlertExistingKeywordProps> = ({keyword}) => {
    const [existing] = useSelector(keywordSelector(keyword));
    if (!existing) {
        return null;
    }
    return (
        <Alert color="warning" title="Warning">
            '{existing.keyword}' already exists. (type: {existing.pagetype})
        </Alert>
    )
}

export default AlertExistingKeyword;
