import {Action, combineReducers} from "redux";
import {RootState} from "../index";

export interface Site {
    name: string,
    domain: string,
}
export const sites:Site[] = [
    {name: 'b2b', domain: 'b2b.chums.com'},
    {name: 'safety', domain: 'chumssafety.com'}
];

export const defaultSite =  sites[0];

export interface SiteAction extends Action {
    payload: {
        site?: Site,
    }
}

export const siteSelected = 'site/selected';

export const siteSelectedAction = (site:Site = defaultSite):SiteAction => ({type: siteSelected, payload: {site}});

export const currentSiteSelector = (state:RootState) => state.sites.selected;

const selected = (state:Site = {...defaultSite}, action:SiteAction) => {
    const {type, payload} = action;
    switch (type) {
    case siteSelected:
        return payload.site || defaultSite;
    default:
        return state;
    }
}

export default combineReducers({
    selected,
})
