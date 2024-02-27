import React, {useRef} from 'react';
import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';
import {Identifier, XYCoord} from "dnd-core";
import classNames from "classnames";
import {itemTypes,} from "./index";
import ProductImage from "./ProductImage";
import {useSelector} from "react-redux";
import isURL from 'validator/lib/isURL';
import {setCurrentItem} from "./actions";
import "./ItemCard.scss";
import {isCategoryChildCategory, isCategoryChildLink, isCategoryChildProduct} from "./utils";
import {useAppDispatch} from "../../app/configureStore";
import {selectCurrentItem} from "./selectors";
import {CategoryItem} from "../types";


interface ItemCardProps {
    item: CategoryItem,
    index: number,
    moveItem: (dragIndex: number, hoverIndex: number) => void,
}

interface DragItem {
    index: number,
    id: string,
    type: string,
}

const style = {
    cursor: 'move',
}

const SortableCategoryItem = ({item, index, moveItem}: ItemCardProps) => {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const current = useSelector(selectCurrentItem);

    const [, drop] = useDrop<DragItem, void, {handlerId: Identifier|null}>({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = Math.ceil((hoverBoundingRect.bottom - hoverBoundingRect.top) / 2);

            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && (hoverClientY < hoverMiddleY)) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{isDragging}, drag] = useDrag({
        type: 'item',
        item: () => {
            return {item, index};
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const isInactive = !item.status
        || (isCategoryChildCategory(item) && !item.category?.status)
        || (isCategoryChildProduct(item) && !item.product?.status)

    const className = {
        dragging: isDragging,
        product: item.itemType === itemTypes.product,
        category: item.itemType === itemTypes.category,
        section: item.itemType === itemTypes.section,
        link: item.itemType === itemTypes.link,
        inactive: isInactive,
    };
    const btnClassName = {
        'btn-outline-primary': current?.id === item.id,
        'btn-dark': current?.id !== item.id && !isInactive,
        'btn-danger': isInactive && !!item.status,
    };

    const onClick = () => {
        dispatch(setCurrentItem(item));
    };

    return (
        <div ref={ref} style={{...style, opacity}}
             className={classNames("sortable-item", className)}>
            <button type="button" onClick={onClick}
                    className={classNames("btn btn-sm mb-1 sortable-item--edit-button", btnClassName)}>
                Edit
            </button>
            <div className="sortable-item-padding">
                <div className="sortable-item-content">
                    {!item.urlOverride && <div>{item.title || item.sectionTitle}</div>}
                    {!!item.urlOverride && (
                        <div>
                            <a href={
                                isURL(item.urlOverride)
                                    ? item.urlOverride
                                    : `https://b2b.chums.com/${item.urlOverride.replace(/^\//, '')}`}
                               target="_blank">
                                {item.title || item.sectionTitle}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SortableCategoryItem;
