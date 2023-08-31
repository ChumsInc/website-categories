import {ProductCategoryChild} from "b2b-types";
import {fetchJSON} from "chums-components";
import {CategoryItem} from "../ducks/types";

export interface ItemArg {
    parentId: number;
    id?: number;
}

export async function deleteItem(arg: Required<ItemArg>): Promise<ProductCategoryChild[]> {
    try {
        const url = `/api/b2b/products/category/${encodeURIComponent(arg.parentId)}/item/${encodeURIComponent(arg.id)}`;
        const res = await fetchJSON<{ items: ProductCategoryChild[] }>(url, {method: 'DELETE'});
        return res.items ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteItem()", err);
        return Promise.reject(new Error('Error in deleteItem()'));
    }
}

export async function postItem(arg: CategoryItem): Promise<ProductCategoryChild | null> {
    try {
        const url = '/api/b2b/products/category/item';
        const res = await fetchJSON<{ item: ProductCategoryChild }>(url, {method: 'POST', body: JSON.stringify(arg)});
        return res.item ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("postItem()", err);
        return Promise.reject(new Error('Error in postItem()'));
    }
}

export interface PostItemSortArg {
    parentId: number;
    items: Pick<ProductCategoryChild, 'id' | 'priority'>[];
}

export async function postItemSort(arg: PostItemSortArg): Promise<ProductCategoryChild[]> {
    try {
        const url = `/api/b2b/products/category/${encodeURIComponent(arg.parentId)}/sort`;
        const body = JSON.stringify({items: arg.items});
        const res = await fetchJSON<{ categoryItems: ProductCategoryChild[] }>(url, {method: 'POST', body});
        return res.categoryItems ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postItemSort()", err.message);
            return Promise.reject(err);
        }
        console.debug("postItemSort()", err);
        return Promise.reject(new Error('Error in postItemSort()'));
    }
}


export async function fetchItem(arg: ItemArg): Promise<ProductCategoryChild | null> {
    try {
        const url = `/api/b2b/products/category/${encodeURIComponent(arg.parentId)}/items/${encodeURIComponent(arg.id ?? '')}`
        const res = await fetchJSON<{ categoryItems: ProductCategoryChild[] }>(url, {cache: 'no-cache'});
        if (!res.categoryItems?.length) {
            return null;
        }
        return res.categoryItems[0];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItem()", err);
        return Promise.reject(new Error('Error in fetchItem()'));
    }
}
