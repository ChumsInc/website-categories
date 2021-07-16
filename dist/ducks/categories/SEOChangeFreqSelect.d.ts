import React from "react";
import { InputField } from "chums-ducks/dist/types";
export interface SEOChangeFreqSelectProps {
    value: string;
    field: string;
    required?: boolean;
    onChange: ({ field, value }: InputField) => void;
}
declare const SEOChangeFreqSelect: React.FC<SEOChangeFreqSelectProps>;
export default SEOChangeFreqSelect;
