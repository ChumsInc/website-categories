import {CategoryChildLink, CategoryChildSection} from "b2b-types";
import {CategoryItem, CategoryItemCategory, CategoryItemProduct} from "../types";


export function isCategoryChildSection(item: CategoryItem | null): item is CategoryChildSection {
    return item?.itemType === 'section';
}

export function isCategoryChildCategory(item: CategoryItem | null): item is CategoryItemCategory {
    return item?.itemType === 'category';
}

export function isCategoryChildProduct(item: CategoryItem | null): item is CategoryItemProduct {
    return item?.itemType === 'product';
}

export function isCategoryChildLink(item: CategoryItem | null): item is CategoryChildLink {
    return item?.itemType === 'link';
}


