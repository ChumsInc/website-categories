import { Category } from "../types";
import { Site } from "../sites";
export declare const calcChildIds: (categories: Category[], id?: number) => number[];
export declare const previewURL: (site: Site, keyword: string) => string;
export declare const calcParentIds: (categories: Category[], parentId?: number) => number[];
export declare const getParentIds: (categories: Category[], parentId?: number) => number[];
