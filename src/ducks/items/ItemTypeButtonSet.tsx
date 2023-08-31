import React from "react";
import {itemTypes} from "./index";
import classNames from "classnames";
import {ItemType} from "../types";
import {useDispatch, useSelector} from "react-redux";
import {updateCurrentItem} from "./actions";
import {selectCurrentItem} from "./selectors";

const buttonClassName = (state: boolean) => {
    return {
        'btn btn-sm': true,
        'btn-outline-secondary': !state,
        'btn-secondary': state
    };
};


const ItemTypeButtonSet = () => {
    const dispatch = useDispatch();
    const item = useSelector(selectCurrentItem);

    const onSelectItemType = (type:ItemType) => {
        if (!item) {
            return;
        }
        switch (type) {
            case 'product':
            case 'link':
                return dispatch(updateCurrentItem({itemType: type, categoriesId: 0}));
            case 'category':
                return dispatch(updateCurrentItem({itemType: type, productsId: 0}));
            case 'section':
                return dispatch(updateCurrentItem({itemType: type, productsId: 0, categoriesId: 0}));
        }
    }

    return (
        <div className="btn-group btn-group-sm item-types">
            <button type="button"
                    onClick={() => onSelectItemType('section')}
                    className={classNames('section', buttonClassName(item?.itemType === 'section'))}>
                Section
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('product')}
                    className={classNames('product', buttonClassName(item?.itemType === 'product'))}>
                Product
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('category')}
                    className={classNames('category', buttonClassName(item?.itemType === itemTypes.category))}>
                Category
            </button>

            <button type="button"
                    onClick={() => onSelectItemType('link')}
                    className={classNames('link', buttonClassName(item?.itemType === itemTypes.link))}>
                Link
            </button>
        </div>
    )
}

export default ItemTypeButtonSet;
