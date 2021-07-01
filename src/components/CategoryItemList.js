import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {saveItemSort, selectItem, sortItem} from "../actions";
import CategoryItem from "./CategoryItem";
import {itemSortPriority} from '../utils';
import {SITES} from "../constants";

class CategoryItemList extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            priority: PropTypes.number,
        })),
        site: PropTypes.string,
        sorted: PropTypes.number,
        item: PropTypes.shape({
            id: PropTypes.number,
        }),
        loadingCategory: PropTypes.bool,

        sortItem: PropTypes.func.isRequired,
        selectItem: PropTypes.func.isRequired,
        saveItemSort: PropTypes.func.isRequired,
    };

    static defaultProps = {
        items: [],
        site: SITES.chums,
        item: {},
        loadingCategory: false,
    };

    constructor(props) {
        super(props);
        this.moveItem = this.moveItem.bind(this);
    }

    moveItem(dragIndex, hoverIndex) {
        // console.log({dragIndex, hoverIndex});
        this.props.sortItem({dragIndex, hoverIndex});
    }


    render() {
        const {items, selectItem, site, item: selectedItem, saveItemSort} = this.props;
        return (
            <div className="sortable-item-list">
                {items
                    .sort(itemSortPriority)
                    .map((item, i) => (
                        <CategoryItem key={item.id} index={i}
                                      id={item.id} title={item.title || item.sectionTitle}
                                      itemType={item.itemType} status={item.status}
                                      product={item.product} category={item.category}
                                      imageUrl={item.imageUrl} selected={item.id === selectedItem.id}
                                      urlOverride={item.urlOverride} site={site}
                                      onClick={() => selectItem(item)}
                                      moveItem={this.moveItem} dropItem={saveItemSort}/>
                    ))}
            </div>
        );
    }
}


const mapStateToProps = ({category, items, site, item}) => {
    const {sorted = null} = category;
    return {items, sorted, site, item};
};

const mapDispatchToProps = {
    sortItem,
    selectItem,
    saveItemSort,
};



export default connect(mapStateToProps, mapDispatchToProps)(CategoryItemList) 
