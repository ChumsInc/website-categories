import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {itemSortPriority} from '../../utils';
import {itemLoadingSelector, listSelector, savingSortSelector} from "./index";
import ItemCard from "./ItemCard";
import {saveItemSortAction} from "./actions";
import {loadingSelector} from "../categories";
import {Progress, ProgressBar} from "chums-ducks/dist/components";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const CategoryItemList: React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(listSelector);
    const loadingCategory = useSelector(loadingSelector);
    const loadingItems = useSelector(itemLoadingSelector);
    const saving = useSelector(savingSortSelector);
    const loading = loadingCategory || loadingItems || saving;

    const [items, setItems] = useState(list);
    useEffect(() => {
        setItems(list);
    }, [list]);

    const onMoveItem = (dragIndex: number, hoverIndex: number) => {
        const sorted = [...items];
        const movingItem = sorted[dragIndex];
        sorted.splice(dragIndex, 1);
        sorted.splice(hoverIndex, 0, movingItem);
        let priority = 0;
        sorted.forEach(item => {
            item.priority = priority;
            priority += 1;
        });
        setItems(sorted);
    }

    const onSave = () => dispatch(saveItemSortAction(items));
    return (
        <div>
            <div className="row my-1 align-items-center">
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
            </div>
            <hr/>
            <DndProvider backend={HTML5Backend}>
                <div className="sortable-item-list">
                    {items
                        .sort(itemSortPriority)
                        .map((item, index) => (
                                <ItemCard key={item.id} index={index} item={item} moveItem={onMoveItem}/>
                            )
                        )}
                </div>
            </DndProvider>
        </div>
    )
}

export default CategoryItemList;
