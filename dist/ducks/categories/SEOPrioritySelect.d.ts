import React from "react";
import { InputField } from "chums-ducks/dist/types";
export interface SEOPrioritySelectProps {
    value: number;
    field: string;
    required?: boolean;
    onChange: ({ field, value }: InputField) => void;
}
declare const SEOPrioritySelect: React.FC<SEOPrioritySelectProps>;
export default SEOPrioritySelect;
