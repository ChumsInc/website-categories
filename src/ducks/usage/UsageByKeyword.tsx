import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadUsage, selectUsageByKeyword} from "./index";

const UsageByKeyword = ({keyword}:{keyword?:string}) => {
    const dispatch = useAppDispatch();
    const usage = useAppSelector((state) => selectUsageByKeyword(state, keyword));

    useEffect(() => {
        dispatch(loadUsage(keyword));
    }, [keyword]);

    return (
        <table className="table table-xs table-striped caption-top">
            <caption>Keyword Usage</caption>
            <thead>
            <tr>
                <th>ID</th>
                <th>Page Keyword</th>
                <th>Page Title</th>
                <th>Item Title</th>
                <th>Item Status</th>
                <th className="text-center">Product Keyword</th>
                <th className="text-center">Product Status</th>
            </tr>
            </thead>
            <tbody>
            {usage?.products.map(row => (
                <tr key={`products-${row.categorypage_id}`}>
                    <td>{row.categorypage_id}</td>
                    <td>{row.page_keyword}</td>
                    <td>{row.page_title}</td>
                    <td>{row.item_title}</td>
                    <td className="text-center">{row.item_status ? <span className="bi-check-square"/> : <span className="bi-square" /> }</td>
                    <td>{row.products_keyword}</td>
                    <td className="text-center">{row.products_status ? <span className="bi-check-square"/> : <span className="bi-square" /> }</td>
                </tr>
            ))}
            {usage?.categories.map(row => (
                <tr key={`categories-${row.categorypage_id}`}>
                    <td>{row.categorypage_id}</td>
                    <td>{row.page_keyword}</td>
                    <td>{row.page_title}</td>
                    <td>{row.item_title}</td>
                    <td className="text-center">{row.item_status ? <span className="bi-check-square"/> : <span className="bi-square" /> }</td>
                    <td />
                    <td />
                </tr>
            ))}
            {usage?.menus.map(row => (
                <tr key={`menu-${row.menu_id}`}>
                    <td>{row.menu_id}</td>
                    <td>{row.title}</td>
                    <td>{row.item_title}</td>
                    <td>{row.url}</td>
                    <td className="text-center">{row.item_status ? <span className="bi-check-square"/> : <span className="bi-square" /> }</td>
                    <td />
                    <td />
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default UsageByKeyword;
