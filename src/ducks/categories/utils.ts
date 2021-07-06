import {Category} from "../types";

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
