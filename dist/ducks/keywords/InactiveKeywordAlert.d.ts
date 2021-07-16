import React from 'react';
import { ItemType } from "../types";
interface InactiveAlertProps {
    keyword?: string;
    id?: number;
    itemType?: ItemType;
}
declare const InactiveKeywordAlert: React.FC<InactiveAlertProps>;
export default InactiveKeywordAlert;
