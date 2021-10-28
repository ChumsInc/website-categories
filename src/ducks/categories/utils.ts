import {Category} from "../types";
import {Site} from "../sites";
import {buildPath} from "chums-ducks";
import {PREVIEW_URL} from "../../constants";

export const calcChildIds = (categories:Category[], id:number = 0):number[] => {
    if (!id) {
        return [];
    }
    const children = categories.filter(cat => cat.parentId === id).map(cat => cat.id);
    if (children.length) {
        return [id, ...children.map(id => calcChildIds(categories, id)).flat()];
    }
    return [id];
};

export const previewURL = (site:Site, keyword:string) => {
    switch (site.name) {
    case 'b2b':
        return buildPath('https\\://b2b.chums.com/products/:keyword', {keyword});
    case 'safety':
    default:
        return buildPath('https\\://chumssafety.com/:keyword', {keyword});
    }
}

export const calcParentIds = (categories: Category[], parentId:number = 0): number[] => {
    if (!parentId) {
        return [];
    }
    const [category] = categories.filter(cat => cat.id === parentId);
    if (category?.id) {
        return [parentId, ...calcParentIds(categories, category.parentId)];
    }
    return [parentId];
};


export const getParentIds = (categories: Category[], parentId:number = 0): number[] => {
    return calcParentIds(categories, parentId).filter(id => id !== parentId);
};
