import {ProductCategory} from "b2b-types";
import {fetchJSON} from "chums-components";

export async function fetchCategories(arg?: number): Promise<ProductCategory[]> {
    try {
        const url = `/api/b2b/products/category/${encodeURIComponent(arg ?? '')}`;
        const res = await fetchJSON<{ categories: ProductCategory[] }>(url, {cache: 'no-cache'});
        return res.categories ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCategories()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategories()", err);
        return Promise.reject(new Error('Error in fetchCategories()'));
    }
}

export async function fetchCategory(arg: number): Promise<ProductCategory | null> {
    try {
        const [category] = await fetchCategories(arg);
        return category || null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategory()", err);
        return Promise.reject(new Error('Error in fetchCategory()'));
    }
}


export async function postCategory(arg: ProductCategory): Promise<ProductCategory | null> {
    try {
        const url = `/api/b2b/products/category/${encodeURIComponent(arg.id ?? '')}`;
        const {children, ...rest} = arg;
        const body = JSON.stringify(rest);
        const res = await fetchJSON<{ category: ProductCategory }>(url, {method: 'POST', body});
        return res.category ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCategory()", err);
        return Promise.reject(new Error('Error in postCategory()'));
    }
}
