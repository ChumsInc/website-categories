import {ProductCategory} from "b2b-types";
import {CategoryItem} from "./ducks/types";

export const calcParentIds = (categories: ProductCategory[], parentId = 0): number[] => {
    if (!parentId) {
        return [];
    }
    const [category] = categories.filter(cat => cat.id === parentId);
    if (!!category?.id) {
        return [parentId, ...calcParentIds(categories, category.parentId)];
    }
    return [parentId];
};

export const disableParentId = (categories: ProductCategory[] = [], id: number): number => {
    const [category] = categories.filter(cat => cat.id === id);
    return category?.parentId ?? disableParentId(categories, category.parentId);
};

export const calcChildIds = (categories: ProductCategory[], id: number = 0): number[] => {
    if (!id) {
        return [];
    }
    const children = categories.filter(cat => cat.parentId === id).map(cat => cat.id);
    if (children.length) {
        return [id, ...children.map(id => calcChildIds(categories, id)).flat()];
    }
    return [id];
};

export const parseImageFilename = ({image, colorCode = ''}: { image: string, colorCode?: string }): string => {
    if (!image) {
        return '';
    }
    colorCode = String(colorCode);

    image = image.replace(/(%|\?)/, colorCode);
    colorCode.split('').map(code => {
        image = image.replace(/\*/, code);
    });
    return image.replace(/\*/g, '');
};

export const now = () => {
    return new Date().valueOf()
};

export const itemSortPriority = (a: CategoryItem, b: CategoryItem) => a.priority - b.priority;
