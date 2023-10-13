import React, {useEffect, useState} from 'react';
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
    }, [list]);

    const onMoveItem = (dragIndex: number, hoverIndex: number) => {
        const sorted = [...items];
        if (!sorted[dragIndex]) {
            return;
        }
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        const newSort = sorted.map((item, index) => {
            return {
                ...item,
                priority: index,
            }
        })
        setItems(newSort);
    }

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
                    {items.map((item, index) => (
                            <SortableCategoryItem key={item.id} index={index} item={item} moveItem={onMoveItem}/>
                        )
                    )}
                </div>
            </DndProvider>
        </div>
    )
}

export default CategoryItemList;
