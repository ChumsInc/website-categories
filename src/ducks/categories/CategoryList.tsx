import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import {filteredListSelector, filterSelector, selectedCategorySelector} from "./index";
import {loadCategoriesAction, selectCategoryAction} from "./actions";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks/dist/ducks";
import {Category} from "../types";
import {loadKeywords} from "../keywords";
import {ErrorBoundary} from "chums-ducks/dist/components";


const Title: React.FC<{ title: string }> = ({title}) => (<span dangerouslySetInnerHTML={{__html: title}}/>)

const TABLE = 'categories';

const fields: SortableTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'title', title: 'Name', sortable: true, render: ({title}: { title: string }) => <Title title={title}/>},
    {field: 'parentId', title: 'Parent', sortable: true},
    {field: 'changefreq', title: 'Change Freq.', sortable: true}
];

const rowClassName = ({status}: Category) => ({'table-warning': status === 0})

const CategoryList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadCategoriesAction());
        dispatch(loadKeywords());
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'keyword', ascending: true}));
    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    // const loading = useSelector(loadingSelector);
    const list = useSelector(filteredListSelector(sort));
    const pagedList = useSelector(pagedDataSelector(TABLE, list));
    const selected = useSelector(selectedCategorySelector);
    const onSelectCategory = (cat: Category) => dispatch(selectCategoryAction(cat));
    const filter = useSelector(filterSelector);


    return (
        <div>
            <ErrorBoundary>
                <CategoryListFilter/>
            </ErrorBoundary>
            <div className="table-responsive-sm mt-3">
                <ErrorBoundary>
                    <SortableTable tableKey={TABLE} keyField="keyword" fields={fields} data={pagedList}
                                   rowClassName={rowClassName}
                                   selected={selected.keyword} onSelectRow={onSelectCategory}/>
                </ErrorBoundary>
            </div>
            <PagerDuck pageKey={TABLE} dataLength={list.length} filtered={!!filter}/>
        </div>
    )
}

export default CategoryList;
