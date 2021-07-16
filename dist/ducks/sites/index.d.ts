import { Action } from "redux";
import { RootState } from "../index";
export interface Site {
    name: string;
    domain: string;
}
export declare const sites: Site[];
export declare const defaultSite: Site;
export interface SiteAction extends Action {
    payload: {
        site?: Site;
    };
}
export declare const siteSelected = "site/selected";
export declare const siteSelectedAction: (site?: Site) => SiteAction;
export declare const currentSiteSelector: (state: RootState) => import("chums-ducks").Site;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    selected: Site;
}>, SiteAction>;
export default _default;
