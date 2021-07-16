import React, {ChangeEvent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {sites, siteSelectedAction, currentSiteSelector} from './index';

const SiteSelect: React.FC = () => {
    const dispatch = useDispatch();
    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const {value} = ev.target;
        const [site] = sites.filter(s => s.name === value);
        dispatch(siteSelectedAction(site));
    }
    const site = useSelector(currentSiteSelector);

    return (
        <select className="form-select form-select-sm" value={site.name} onChange={changeHandler}>
            {sites.map(site => (<option key={site.name} value={site.name}>{site.domain}</option>))}
        </select>
    )
}
export default SiteSelect;
