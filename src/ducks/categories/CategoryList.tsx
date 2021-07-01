import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch, useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import SortableTable from "../../components/SortableTable";
import {fetchCategories, selectCategory} from '../../actions';
import ProgressBar from "../../components/ProgressBar";
import {Category} from "../types";
import {loadingSelector} from "./index";
import {filteredListSelector} from "./index";
import SortableTableHead from "../../common-components/SortableTableHead";
import {SortableTableField} from "../../common-components/SortableTH";
import {sortableTableSelector, tableAddedAction, sortChangedAction} from "../sortableTables";

const Title:React.FC<{title:string}> = ({title}) => (<span dangerouslySetInnerHTML={{__html: title}}/>)

const TABLE = 'categories';

const fields:SortableTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'title', title: 'Name', sortable: true, render: ({title}:{title:string}) => <Title title={title} />},
    {field: 'parentId', title: 'Parent', sortable: true},
    {field: 'changefreq', title: 'Change Freq.', sortable: true}
];

const CategoryList:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tableAddedAction({key: TABLE, field: 'keyword', ascending: true}));
    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const loading = useSelector(loadingSelector);
    const list = useSelector(filteredListSelector);

    const sortChangeHandler = (field: string, ascending: boolean) => {
        dispatch(sortChangedAction({key: TABLE, field, ascending}));
    }

    return (
        <div>
            <CategoryListFilter />
            {loading && <ProgressBar striped={true} className="mt-1"/>}
            <div className="table-responsive-sm mt-3">
                <table className="table table-xs table-sticky">
                    <SortableTableHead fields={fields} onChangeSort={sortChangeHandler} sortField={sort.field} sortAsc={sort.ascending}  />
                </table>
            </div>
        </div>
    )
}

