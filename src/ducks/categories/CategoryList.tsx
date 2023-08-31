import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import CategoryListFilter from "./CategoryListFilter";
import {
    selectCategoriesLoading,
    selectCategoryFilter,
    selectCategorySort,
    selectCurrentCategory,
    selectFilteredList,
} from "./selectors";
import {loadCategories, loadCategory, setCategoriesSort} from "./actions";
import {loadKeywords} from "../keywords";
import {ErrorBoundary} from "react-error-boundary";
import FriendlyDate from "../../components/FriendlyDate";
import ErrorFallbackComponent from "../../components/ErrorFallbackComponent";
import {useAppDispatch} from "../../app/configureStore";
import {ProductCategory} from "b2b-types";
import {SortableTable, SortableTableField, TablePagination} from "chums-components";
import LoadingProgress from "chums-components/dist/LoadingProgressBar";


const Title: React.FC<{ title: string }> = ({title}) => (<span dangerouslySetInnerHTML={{__html: title}}/>)

const fields: SortableTableField<ProductCategory>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'title', title: 'Name', sortable: true, render: ({title}: { title: string }) => <Title title={title}/>},
    {field: 'parentId', title: 'Parent', sortable: true},
    {field: 'changefreq', title: 'Change Freq.', sortable: true},
    {
        field: 'timestamp', title: 'Updated', sortable: true, render: (row: ProductCategory) => <FriendlyDate
            date={row.timestamp}/>
    }
];

const rowClassName = (row:ProductCategory) => ({'table-warning': !row.status})

const CategoryList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredList);
    const current = useSelector(selectCurrentCategory);
    const filter = useSelector(selectCategoryFilter);
    const loading = useSelector(selectCategoriesLoading);
    const sort = useSelector(selectCategorySort);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    useEffect(() => {
        setPage(0);
    }, [sort, rowsPerPage, filter]);

    useEffect(() => {
        dispatch(loadCategories());
        dispatch(loadKeywords());
    }, []);

    const onSelectCategory = (cat: ProductCategory) => {
        dispatch(loadCategory(cat));
    }

    return (
        <ErrorBoundary FallbackComponent={(arg) => <ErrorFallbackComponent error={arg.error}
                                                                           resetErrorBoundary={arg.resetErrorBoundary}/>}>
            <CategoryListFilter/>
            <div className="mt-3">
                <SortableTable keyField="keyword" fields={fields}
                               data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                               currentSort={sort} onChangeSort={sort => dispatch(setCategoriesSort(sort))}
                               size="xs"
                               rowClassName={rowClassName}
                               selected={current?.keyword} onSelectRow={onSelectCategory}/>
            </div>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={setRowsPerPage}
                             showFirst showLast
                             count={list.length}/>
        </ErrorBoundary>
    )
}

export default React.memo(CategoryList);
