import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import {ITEM_TYPES, PATH_LINK_IMAGE, PATH_PRODUCT_IMAGE, PATH_URL_OVERRIDE, SITE_NAMES} from "../constants";
import classNames from 'classnames';
import {parseImageFilename} from "../utils";
import {buildPath} from "../fetch";
import isURL from 'validator/lib/isURL';

const itemSource = {
    beginDrag({id, index}) {
        return {id, index};
    }
};

const itemTarget = {
    drop(props) {
        props.dropItem();
    },
    hover(props, monitor, component) {
        if (!component) {
            // return null;
        }

        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }


        props.moveItem(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

const sourceCollector = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
};

const targetCollector = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
};

const ProductImage = ({image, defaultColor, imageUrl}) => {
    const imageFile = parseImageFilename({
        image: imageUrl || image || 'missing.png',
        colorCode: defaultColor || ''
    });
    const src = buildPath(PATH_PRODUCT_IMAGE, {imagefile: imageFile});
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl || image} title={imageFile}/>
        </div>
    )
};

const CategoryImage = ({imageUrl}) => {
    const src = buildPath(PATH_PRODUCT_IMAGE, {imagefile: imageUrl || 'missing.png'});
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl} title={imageUrl}/>
        </div>
    )
};

const LinkImage = ({imageUrl}) => {
    const src = buildPath(PATH_LINK_IMAGE, {imagefile: imageUrl || 'missing.png'});
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl} title={imageUrl}/>
        </div>
    )
}

class CategoryItem extends Component {
    static propTypes = {
        site: PropTypes.string,
        connectDragSource: PropTypes.any,
        connectDropTarget: PropTypes.any,
        isDragging: PropTypes.bool,
        isOver: PropTypes.bool,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
        itemType: PropTypes.string,
        status: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        product: PropTypes.object,
        category: PropTypes.object,
        imageUrl: PropTypes.string,
        urlOverride: PropTypes.string,
        selected: PropTypes.bool,

        onClick: PropTypes.func,
    }

    static defaultProps = {
        isDragging: false,
        isOver: false,
        id: 0,
        title: '',
        itemType: ITEM_TYPES.product,
        status: 0,
        product: {},
        category: {},
        imageUrl: '',
        urlOverride: '',
        site: 'chums',
        selected: false,
    };

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        const {isDragging, itemType, status, product, category, connectDropTarget, connectDragSource, onClick,
            imageUrl, urlOverride, site, title, selected,
        } = this.props;

        const opacity = isDragging ? 0.15 : 1;

        const className = {
            dragging: isDragging,
            product: itemType === ITEM_TYPES.product,
            category: itemType === ITEM_TYPES.category,
            section: itemType === ITEM_TYPES.section,
            link: itemType === ITEM_TYPES.link,
            other: itemType === ITEM_TYPES.other,
            inactive: status === 0 || (!!product && product.status === 0)
        };

        const btnClassName = {'btn-light': !selected, 'btn-dark': !!selected};


        return connectDropTarget(
            connectDragSource(
                <div className={classNames("sortable-item", className)} style={{opacity}}>
                    <div>
                        <button type="button"  onClick={onClick}
                                className={classNames("btn btn-sm mb-3", btnClassName)}>
                            Select
                        </button>
                    </div>
                    {itemType === ITEM_TYPES.product && product && <ProductImage {...product} imageUrl={imageUrl}/>}
                    {itemType === ITEM_TYPES.category && category && <CategoryImage imageUrl={imageUrl}/>}
                    {itemType === ITEM_TYPES.link && !!imageUrl && <LinkImage imageUrl={imageUrl}/>}
                    {!urlOverride && <div>{title}</div>}
                    {!!urlOverride && (
                        <div>
                            <a href={isURL(urlOverride) ? urlOverride : buildPath(PATH_URL_OVERRIDE, {site: SITE_NAMES[site]}) + urlOverride}
                               target="_blank">
                                {title}
                            </a>
                        </div>
                    )}
                </div>
            )
        )
    }
}

export default DropTarget('item', itemTarget, targetCollector)(DragSource('item', itemSource, sourceCollector)(CategoryItem));
