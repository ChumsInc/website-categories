import React from "react";
import { Keyword } from "../types";
interface KeywordSelectProps {
    pageType?: 'category' | 'product' | 'page';
    value: string;
    onChange: (keyword?: Keyword) => void;
}
declare const KeywordSelect: React.FC<KeywordSelectProps>;
export default KeywordSelect;
