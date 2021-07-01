export const calcParentIds = (categories, parentId = 0) => {
    if (!parentId) {
        return [];
    }
    const [category = {}] = categories.filter(cat => cat.id === parentId);
    if (!!category.id) {
        return [parentId, ...calcParentIds(categories, category.parentId)];
    }
    return [parentId];
};


export const getParentIds = (categories, parentId = 0) => {
    return calcParentIds(categories, parentId).filter(id => id !== parentId);
};

export const disableParentId = (categories = [], id) => {
    const [category = false] = categories.filter(cat => cat.id === id);
    return category.parentId || disableParentId(categories, category.parentId);
};

export const calcChildIds = (categories, id = 0) => {
    if (!id) {
        return [];
    }
    const children = categories.filter(cat => cat.parentId === id).map(cat => cat.id);
    if (children.length) {
        return [id, ...children.map(id => calcChildIds(categories, id)).flat()];
    }
    return [id];
};

export const parseImageFilename = ({image, colorCode = ''}) => {
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

export const itemSortPriority = (a, b) => a.priority - b.priority;

export class LocalStore {
    static getItem(key) {
        const data = window.localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch(err) {
            console.log("getItem()", key, err.message);
            return data;
        }
    }

    static setItem(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key) {
        window.localStorage.removeItem(key);
    }
}

export const noop = () => {};
