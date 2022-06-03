import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import {selectFilteredList, selectCategoryFilter, selectCurrentCategory} from "./index";
import {loadCategoriesAction, selectCategoryAction} from "./actions";
import {
    addPageSetAction,
    pagedDataSelector,
    PagerDuck, selectPagedData, selectTableSort,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks/dist/ducks";
import {Category} from "../types";
import {loadKeywordsAction} from "../keywords";
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
        dispatch(loadKeywordsAction());
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'keyword', ascending: true}));
    }, []);
    const sort = useSelector(selectTableSort(TABLE))
    const list = useSelector(selectFilteredList(sort));
    const pagedList = useSelector(selectPagedData(TABLE, list));
    const selected = useSelector(selectCurrentCategory);
    const filter = useSelector(selectCategoryFilter);

    const onSelectCategory = (cat: Category) => dispatch(selectCategoryAction(cat));


    return (
        <ErrorBoundary>
            <CategoryListFilter/>
            <div className="mt-3">
                <ErrorBoundary>
                    <SortableTable tableKey={TABLE} keyField="keyword" fields={fields} data={pagedList}
                                   size="xs"
                                   rowClassName={rowClassName}
                                   selected={selected.keyword} onSelectRow={onSelectCategory}/>
                </ErrorBoundary>
            </div>
            <PagerDuck pageKey={TABLE} dataLength={list.length} filtered={!!filter}/>
        </ErrorBoundary>
    )
}

export default CategoryList;
