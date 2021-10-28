import React from "react";
import {itemTypes, selectCurrentItem} from "./index";
import classNames from "classnames";
import {ItemType} from "../types";
import {useDispatch, useSelector} from "react-redux";
import {updateItemAction} from "./actions";

const buttonClassName = (state: boolean) => {
    return {
        'btn btn-sm': true,
        'btn-outline-secondary': !state,
        'btn-secondary': state
    };
};


const ItemTypeButtonSet:React.FC = () => {
    const dispatch = useDispatch();
    const {itemType} = useSelector(selectCurrentItem);

    const onSelectItemType = (type:ItemType) => dispatch(updateItemAction({itemType: type}));
    return (
        <div className="btn-group btn-group-sm item-types">
            <button type="button"
                    onClick={() => onSelectItemType('section')}
                    className={classNames('section', buttonClassName(itemType === 'section'))}>
                Section
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('product')}
                    className={classNames('product', buttonClassName(itemType === 'product'))}>
                Product
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('category')}
                    className={classNames('category', buttonClassName(itemType === itemTypes.category))}>
                Category
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('link')}
                    className={classNames('link', buttonClassName(itemType === itemTypes.link))}>
                Link
            </button>
        </div>
    )
}

export default ItemTypeButtonSet;
