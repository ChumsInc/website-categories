import React, {useRef} from 'react';
import {useDrag, useDrop, DropTargetMonitor} from 'react-dnd';
import {Item} from "../types";
import {XYCoord} from "dnd-core";
import classNames from "classnames";
import {itemTypes, selectCurrentItem} from "./index";
import ProductImage from "./ProductImage";
import {useDispatch, useSelector} from "react-redux";
import CategoryImage from "./CategoryImage";
import {buildPath} from "chums-ducks";
import {PATH_URL_OVERRIDE, SITE_NAMES} from "../../constants";
import {currentSiteSelector} from "../sites";
import isURL from 'validator/lib/isURL';
import {selectItemAction} from "./actions";
import "./ItemCard.scss";


interface ItemCardProps {
    item:Item,
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

const ItemCard:React.FC<ItemCardProps> = ({item, index, moveItem}) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const selected = useSelector(selectCurrentItem);
    const site = useSelector(currentSiteSelector);

    const [{handlerId}, drop] = useDrop({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor:DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
            const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

            if (dragIndex < hoverIndex && (hoverClientX < hoverMiddleX || hoverClientY < hoverMiddleY) ) {
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
        collect: (monitor:any) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const {itemType, product, category, imageUrl, urlOverride} = item;

    const className = {
        dragging: isDragging,
        product: itemType === itemTypes.product,
        category: itemType === itemTypes.category,
        section: itemType === itemTypes.section,
        link: itemType === itemTypes.link,
        other: itemType === itemTypes.html,
        inactive: !(!!item.status || (!!product && !!product.status))
    };
    const btnClassName = {
        'btn-light': selected.id === item.id,
        'btn-dark': selected.id !== item.id
    };

    const onClick = () => {
        dispatch(selectItemAction(item));
    };

    return (
        <div ref={ref} style={{...style, opacity}} data-handler-id={handlerId}
             className={classNames("sortable-item", className)}>
            <button type="button"  onClick={onClick}
                    className={classNames("btn btn-sm mb-1 sortable-item--edit-button", btnClassName)}>
                Edit
            </button>
            <div className="sortable-item-padding">
                {itemType === itemTypes.product && product && <ProductImage image={product.image} defaultColor={product.defaultColor} imageUrl={imageUrl}/>}
                {itemType === itemTypes.category && category && <ProductImage imageUrl={imageUrl}/>}
                {itemType === itemTypes.link && !!imageUrl && <ProductImage imageUrl={imageUrl}/>}
                {!urlOverride && <div>{item.title || item.sectionTitle}</div>}
                {!!urlOverride && (
                    <div>
                        <a href={isURL(urlOverride) ? urlOverride : buildPath(PATH_URL_OVERRIDE, {site: site.domain}) + urlOverride}
                           target="_blank">
                            {item.title || item.sectionTitle}
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItemCard;
