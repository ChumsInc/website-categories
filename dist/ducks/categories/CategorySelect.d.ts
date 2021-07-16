import React, { ChangeEvent } from 'react';
export interface CategorySelectProps {
    value: number | string;
    disallow: number[];
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => any;
    required?: boolean;
    disabled?: boolean;
}
declare const CategorySelect: React.FC<CategorySelectProps>;
export default CategorySelect;
