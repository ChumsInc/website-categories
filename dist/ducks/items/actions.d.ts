import { Item } from "../types";
import { ItemsAction, ItemsThunkAction } from "./index";
export declare const categoryItemsURL: (siteName: string) => "/api/b2b/products/category/:parentId/items/:id(\\d+)?" | "/node-safety/products/category/:parentId/items/:id(\\d+)?";
export declare const selectItemAction: (item: Item) => ItemsThunkAction;
export declare const fetchItemAction: (id: number) => ItemsThunkAction;
export declare const saveItemSortAction: (items: Item[]) => ItemsThunkAction;
export declare const updateItemAction: (change: Object) => ItemsAction;
export declare const saveCategoryItemAction: () => ItemsThunkAction;
export declare const deleteCategoryItemAction: () => ItemsThunkAction;
export declare const createNewItemAction: (parentId: number) => {
    type: string;
    payload: {
        item: {
            parentId: number;
            id: number;
            itemType: import("../types").ItemType;
            sectionTitle: string;
            sectionDescription: string;
            title: string;
            description: string;
            urlOverride: string;
            className: string;
            imageUrl: string;
            productsId: number;
            categoriesId: number;
            priority: number;
            status: number | boolean;
            timestamp: string;
            category?: import("../types").Category | null | undefined;
            product?: import("../types").Product | null | undefined;
            changed?: boolean | undefined;
        };
    };
};
