export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export const SET_SITE = 'SET_SITE';
export const SET_TAB = 'SET_TAB';

export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';

export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const FETCH_CATEGORY = 'FETCH_CATEGORY';

export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const SAVE_CATEGORY = 'SAVE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const SAVE_CATEGORY_ITEM_SORT = 'SAVE_CATEGORY_ITEM_SORT';

export const SELECT_CATEGORY_ITEM = 'SELECT_CATEGORY_ITEM';
export const FETCH_CATEGORY_ITEM = 'FETCH_CATEGORY_ITEM';
export const UPDATE_CATEGORY_ITEM = 'UPDATE_CATEGORY_ITEM';
export const SAVE_CATEGORY_ITEM = 'SAVE_CATEGORY_ITEM';
export const DELETE_CATEGORY_ITEM = 'DELETE_CATEGORY_ITEM';

export const SORT_ITEMS = 'SORT_ITEMS';
export const CREATE_NEW_ITEM = 'CREATE_NEW_ITEM';

export const FETCH_KEYWORDS = 'FETCH_KEYWORDS';
export const FETCH_KEYWORD = 'FETCH_KEYWORD';
export const URL_KEYWORDS = '/node-:site/keywords/:keyword?';


export const CATEGORIES_URL = '/node-:site/products/category/:id(\\d+)?';
export const CATEGORIES_ITEM_URL = '/node-:site/products/category/:parentId/items/:id(\\d+)?';
export const CATEGORY_SAVE_ITEM_URL = '/node-:site/products/category/item';
export const CATEGORY_DELETE_ITEM_URL = '/node-:site/products/category/item/:id(\\d+)';
export const CATEGORY_SAVE_SORT_URL = '/node-:site/products/category/:parentId(\\d+)/sort';
export const PREVIEW_URL = '//:domain/:keyword';

export const NEW_CATEGORY = {
    id: 0,
    keyword: '',
    title: '',
    pageText: '',
    descriptionMeta: '',
    parentId: null,
    status: 1,
    changefreq: 'n/a',
    priority: 0.5,
    lifestyle: '',
    css: '',
    items: [],
};

export const NEW_ITEM = {
    id: 0,
    parentId: 0,
    itemType: '',
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
    status: 1,
    category: {},
    product: {},
};

export const SITES = {
    chums: 'chums',
    bc: 'bc',
    safety: 'safety',
    b2b: 'b2b',
};

export const SITE_LIST = [
    SITES.b2b,
    SITES.safety,
    SITES.bc,
];

export const SITE_NAMES = {
    chums: 'chums.com',
    bc: 'beyondcoastal.com',
    safety: 'chumssafety.com',
    b2b: 'b2b.chums.com',
};

export const TABS = {
    edit: 0,
    items: 1
};

export const TAB_LIST = [
    {id: TABS.edit, title: 'Edit Category'},
    {id: TABS.items, title: 'Items'},
];


export const PATH_PRODUCT_IMAGE = 'https://intranet.chums.com/images/products/400/:imageFile';
export const PATH_LINK_IMAGE = 'https://intranet.chums.com/:imagefile';
export const PATH_URL_OVERRIDE = 'https\\://:site';

export const LOCAL_STORE_SITE = 'com.chums.intranet.categories:site';
export const LOCAL_STORE_RPP = 'com.chums.intranet.categories:rpp';
