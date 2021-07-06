import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import ProgressBar from "../../components/ProgressBar";
import {
    filteredListSelector, filterSelector,
    listSelector,
    loadingSelector,
    pagedFilteredListSelector,
    selectedCategorySelector
} from "./index";
import {SortableTableField} from "../sortableTables/SortableTH";
import {sortableTableSelector, tableAddedAction, sortChangedAction} from "../sortableTables";
import {loadCategories, selectCategoryAction} from "./actions";
import {addPageSetAction, pagedDataSelector} from "../page";
import ConnectedPager from "../page/ConnectedPager";
import SortableTable from "../sortableTables/SortableTable";
import {Category} from "../types";

const Title: React.FC<{ title: string }> = ({title}) => (<span dangerouslySetInnerHTML={{__html: title}}/>)

const TABLE = 'categories';

const fields: SortableTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'title', title: 'Name', sortable: true, render: ({title}: { title: string }) => <Title title={title}/>},
    {field: 'parentId', title: 'Parent', sortable: true},
    {field: 'changefreq', title: 'Change Freq.', sortable: true}
];

const rowClassName = ({status}:Category) => ({'table-warning': status === 0})

const CategoryList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'keyword', ascending: true}));
        dispatch(loadCategories());
    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const loading = useSelector(loadingSelector);
    const list = useSelector(filteredListSelector(sort));
    const pagedList = useSelector(pagedDataSelector(TABLE, list));
    const selected = useSelector(selectedCategorySelector);
    const onSelectCategory = (cat: Category) => dispatch(selectCategoryAction(cat));
    const filter = useSelector(filterSelector);


    return (
        <div>
            <CategoryListFilter/>
            {loading && <ProgressBar striped={true} className="mt-1"/>}

            <div className="table-responsive-sm mt-3">
                <SortableTable tableKey={TABLE} keyField="keyword" fields={fields} data={pagedList}
                               rowClassName={rowClassName}
                               selected={selected.keyword} onSelectRow={onSelectCategory}/>
            </div>
            <ConnectedPager pageKey={TABLE} dataLength={list.length} filtered={!!filter}/>
        </div>
    )
}

export default CategoryList;
