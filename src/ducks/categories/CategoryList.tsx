import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import {
    selectFilteredList,
    selectCategoryFilter,
    selectCurrentCategory,
    CategoryListSortableField,
    TABLE_KEY, selectCategoryListCount
} from "./index";
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
import FriendlyDate from "../../components/FriendlyDate";


const Title: React.FC<{ title: string }> = ({title}) => (<span dangerouslySetInnerHTML={{__html: title}}/>)

const fields: CategoryListSortableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'title', title: 'Name', sortable: true, render: ({title}: { title: string }) => <Title title={title}/>},
    {field: 'parentId', title: 'Parent', sortable: true},
    {field: 'changefreq', title: 'Change Freq.', sortable: true},
    {field: 'timestamp', title:'Updated', sortable: true,render: (row:Category) => <FriendlyDate date={row.timestamp} />}
];

const rowClassName = ({status}: Category) => ({'table-warning': status === 0})

const CategoryList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadCategoriesAction());
        dispatch(loadKeywordsAction());
        dispatch(addPageSetAction({key: TABLE_KEY}));
        dispatch(tableAddedAction({key: TABLE_KEY, field: 'keyword', ascending: true}));
    }, []);
    const list = useSelector(selectFilteredList);
    const selected = useSelector(selectCurrentCategory);
    const filter = useSelector(selectCategoryFilter);
    const count = useSelector(selectCategoryListCount);

    const onSelectCategory = (cat: Category) => dispatch(selectCategoryAction(cat));


    return (
        <ErrorBoundary>
            <CategoryListFilter/>
            <div className="mt-3">
                <ErrorBoundary>
                    <SortableTable tableKey={TABLE_KEY} keyField="keyword" fields={fields} data={list}
                                   size="xs"
                                   rowClassName={rowClassName}
                                   selected={selected.keyword} onSelectRow={onSelectCategory}/>
                </ErrorBoundary>
            </div>
            <PagerDuck pageKey={TABLE_KEY} dataLength={count} filtered={!!filter}/>
        </ErrorBoundary>
    )
}

export default React.memo(CategoryList);
