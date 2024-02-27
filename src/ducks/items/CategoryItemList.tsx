import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {itemSortPriority} from '../../utils';
import {selectItemList, selectItemsLoading, selectSortSaving} from "./selectors";
import SortableCategoryItem from "./SortableCategoryItem";
import {saveItemSort} from "./actions";
import {Progress, ProgressBar} from "chums-components";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {useAppDispatch} from "../../app/configureStore";
import {selectCategoriesLoading, selectCurrentCategory} from "../categories/selectors";
import {CategoryItem} from "../types";
import PreviewLink from "../categories/PreviewLink";
import update from 'immutability-helper';

const CategoryItemList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectItemList);
    const current = useSelector(selectCurrentCategory);
    const loadingCategory = useSelector(selectCategoriesLoading);
    const loadingItems = useSelector(selectItemsLoading);
    const saving = useSelector(selectSortSaving);
    const loading = loadingCategory || loadingItems || saving;

    const [items, setItems] = useState<CategoryItem[]>([...list].sort(itemSortPriority));

    useEffect(() => {
        setItems([...list].sort(itemSortPriority));
    }, [list, current]);

    const moveItemHandler = useCallback((dragIndex: number, hoverIndex: number) => {
        setItems((prevItems: CategoryItem[]) => (
            update(prevItems, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevItems[dragIndex] as CategoryItem]
                ]
            })
        ))
    }, [current, list])

    const onSave = () => {
        if (!current) {
            return;
        }
        const saveItems = items.map(item => {
            return {
                id: item.id,
                priority: item.priority,
            }
        })
        dispatch(saveItemSort({parentId: current.id, items: saveItems}));
    }

    const renderedCategoryItem = useCallback((item:CategoryItem, index: number) => {
        return (
            <SortableCategoryItem key={item.id} index={index} item={item} moveItem={moveItemHandler}/>
        )
    }, [current, list])

    return (
        <div>
            <div className="row g-3 mb-1 align-items-baseline">
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-primary" onClick={onSave}
                            disabled={loading || saving}>
                        Save Current Sort
                    </button>
                </div>
                <div className="col">
                    {loading && (
                        <Progress>
                            <ProgressBar animated={true}/>
                        </Progress>
                    )}
                </div>
                <div className="col-auto">
                    <PreviewLink />
                </div>
            </div>
            <hr/>
            <DndProvider backend={HTML5Backend}>
                <div className="sortable-item-list">
                    {items.map((item, index) => renderedCategoryItem(item, index))}
                </div>
            </DndProvider>
        </div>
    )
}

export default CategoryItemList;
