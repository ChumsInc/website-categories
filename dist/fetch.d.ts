/**
 * Created by steve on 8/24/2016.
 */
import 'whatwg-fetch';
declare const _default: ((input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>) & typeof fetch;
export default _default;
export declare const Headers: {
    new (init?: HeadersInit | undefined): Headers;
    prototype: Headers;
};
export declare const Request: {
    new (input: RequestInfo, init?: RequestInit | undefined): Request;
    prototype: Request;
};
export declare const Response: {
    new (body?: BodyInit | null | undefined, init?: ResponseInit | undefined): Response;
    prototype: Response;
    error(): Response;
    redirect(url: string, status?: number | undefined): Response;
};
export declare const fetchOptions: {
    PostJSON: (object?: Object | undefined, options?: RequestInit | undefined) => RequestInit;
    Delete: (options?: RequestInit | undefined) => RequestInit;
};
export declare function fetchGET(url: string, options?: RequestInit): Promise<any>;
export declare function fetchHTML(url: string, options?: RequestInit): Promise<string>;
export declare function fetchPOST(url: string, body: Object, options?: RequestInit): Promise<any>;
export declare function fetchDELETE(url: string, options?: RequestInit): Promise<any>;
export declare const buildPath: (path: string, props?: object) => string;
