import {ProductCategory} from "b2b-types";
import {SortProps} from "chums-components";

export const calcChildIds = (categories: ProductCategory[], id?: number): number[] => {
    if (!id) {
        return [];
    }
    const children = categories.filter(cat => cat.parentId === id).map(cat => cat.id);
    if (children.length) {
        return [id, ...children.map(id => calcChildIds(categories, id)).flat()].sort();
    }
    return [id];
};

export const previewURL = (keyword: string) => {
    return `https://b2b.chums.com/products/${encodeURIComponent(keyword)}`;
}

export const calcParentIds = (categories: ProductCategory[], parentId?: number): number[] => {
    if (!parentId) {
        return [];
    }
    const [category] = categories.filter(cat => cat.id === parentId);
    if (category?.id) {
        return [parentId, ...calcParentIds(categories, category.parentId)];
    }
    return [parentId];
};


export const categorySorter = ({
                                   field,
                                   ascending
                               }: SortProps<ProductCategory>) => (a: ProductCategory, b: ProductCategory) => {
    const ascMod = ascending ? 1 : -1;
    switch (field) {
        case "id":
        case 'priority':
        case "parentId":
            return (a[field] - b[field]) * ascMod;
        case 'timestamp':

        default:
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? (a.keyword > b.keyword ? 1 : -1)
                    : (a[field] ?? '') > (b[field] ?? '') ? 1 : -1
            ) * ascMod;
    }
}
