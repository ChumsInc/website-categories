import React from "react";
import { Keyword } from "../types";
interface ProductSelectProps {
    value: number;
    required?: boolean;
    onChange: (keyword?: Keyword) => void;
}
declare const ProductSelect: React.FC<ProductSelectProps>;
export default ProductSelect;
