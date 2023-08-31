import {CategoryUsage, ProductUsage, UsageResponse} from "../ducks/usage";
import {fetchJSON} from "chums-components";

export async function fetchUsage(arg:string):Promise<UsageResponse> {
    try {
        const url = `/api/b2b/products/category/find/${encodeURIComponent(arg)}`;
        return  await fetchJSON<UsageResponse>(url, {cache: 'no-cache'})
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchUsage()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchUsage()", err);
        return Promise.reject(new Error('Error in fetchUsage()'));
    }
}
