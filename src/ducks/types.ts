import {CategoryChildLink, Editable, ProductCategory} from "b2b-types";
import {BasicProduct, CategoryChildCategory, CategoryChildProduct, CategoryChildSection} from "b2b-types/src/products";

export type ItemType = 'section'|'category'|'product'|'link';

export interface InputField {
    field: string,
    value: string|number|boolean
}

export interface CategoryItemProduct extends Omit<CategoryChildProduct, 'product'> {
    product?: BasicProduct;
}

export interface CategoryItemCategory extends Omit<CategoryChildCategory, 'category'> {
    category?: ProductCategory;
}

export type CategoryItem =  CategoryChildSection | CategoryChildLink | CategoryItemProduct | CategoryItemCategory;

export type EditableCategoryItem = CategoryItem & Editable;

export const defaultCategory:ProductCategory = {
    id: 0,
    parentId: 0,
    title: '',
    keyword: '',
    pageText: '',
    descriptionMeta: '',
    status: true,
    changefreq: 'monthly',
    priority: 0,
    timestamp: '',
    lifestyle: '',
    css: '',
    children: [],
}

export const defaultItem:CategoryItem = {
    id: 0,
    parentId: 0,
    itemType: 'product',
    sectionTitle: '',
    sectionDescription: '',
    title: '',
    description: '',
    urlOverride: '',
    className: '',
    imageUrl: '',
    productsId: 0,
    categoriesId: 0,
    priority: 0,
    status: true,
    timestamp: ''
}
