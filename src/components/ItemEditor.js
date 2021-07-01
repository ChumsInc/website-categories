import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextInput from "./TextInput";
import classNames from "classnames";
import {createNewItem, deleteCategoryItem, saveCategoryItem, updateItem} from '../actions';
import {ITEM_TYPES, NEW_ITEM} from "../constants";
import Button from "./Button";
import FormGroup from "./FormGroup";
import FormGroupTextInput from "./FormGroupTextInput";
import ProductSelect from "./ProductSelect";
import CategorySelect from "./CategorySelect";
import ControlledTextArea from "./ControlledTextArea";
import {calcParentIds, parseImageFilename} from "../utils";
import Alert from "../common-components/Alert";
import ModalEditor from "./ModalEditor";
import ProductInactiveAlert from "./ProductInactiveAlert";
import CategoryInactiveAlert from "./CategoryInactiveAlert";


const buttonClassName = (state) => {
    return {
        'btn btn-sm': true,
        'btn-outline-secondary': !state,
        'btn-secondary': !!state
    };
};

class ItemEditor extends Component {
    static propTypes = {
        id: PropTypes.number,
        parentId: PropTypes.number,
        itemType: PropTypes.string,
        sectionTitle: PropTypes.string,
        sectionDescription: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        urlOverride: PropTypes.string,
        className: PropTypes.string,
        imageUrl: PropTypes.string,
        productsId: PropTypes.number,
        categoriesId: PropTypes.number,
        priority: PropTypes.number,
        status: PropTypes.number,
        changed: PropTypes.bool,
        timestamp: PropTypes.string,
        loadingItem: PropTypes.bool,
        category: PropTypes.shape({
            id: PropTypes.number,
        }),
        product: PropTypes.shape({
            image: PropTypes.string,
            defaultColor: PropTypes.string,
        }),
        disallowedParents: PropTypes.arrayOf(PropTypes.number),

        updateItem: PropTypes.func.isRequired,
        saveCategoryItem: PropTypes.func.isRequired,
        deleteCategoryItem: PropTypes.func.isRequired,
        createNewItem: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...NEW_ITEM,
        changed: false,
        product: {},
        loadingItem: false,
        disallowedParents: [],
    };

    state = {
        showEditor: false,
        editorField: '',
    };


    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeItemType = this.onChangeItemType.bind(this);
        this.onSetEnabled = this.onSetEnabled.bind(this);
        this.onSetDisabled = this.onSetDisabled.bind(this);
        this.onNewItem = this.onNewItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.onClickEditDescription = this.onClickEditDescription.bind(this);
        this.onCloseEditor = this.onCloseEditor.bind(this);
    }

    onClickEditDescription() {
        this.setState({showEditor: true, editorField: 'description'});
    }

    onCloseEditor() {
        this.setState({showEditor: false, editorField: ''});
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.saveCategoryItem();
    }

    onNewItem() {
        const {id} = this.props.category;
        this.props.createNewItem(id);
    }

    onDeleteItem() {
        this.props.deleteCategoryItem();
    }

    onChange({field, value}) {
        this.props.updateItem({[field]: value});
    }

    onChangeItemType({field, value}) {
        switch (value) {
        case ITEM_TYPES.section:
            return this.props.updateItem({[field]: value, productsId: 0, categoriesId: 0});
        case ITEM_TYPES.product:
            return this.props.updateItem({[field]: value, sectionTitle: '', categoriesId: 0});
        case ITEM_TYPES.category:
            return this.props.updateItem({[field]: value, sectionTitle: '', productsId: 0});
        case ITEM_TYPES.link:
            return this.props.updateItem({[field]: value, sectionTitle: '', productsId: 0, categoriesId: 0});
        }
    }

    onSetEnabled() {
        this.props.updateItem({status: 1});
    }

    onSetDisabled() {
        this.props.updateItem({status: 0});
    }

    render() {
        const {
            id, itemType, sectionTitle, sectionDescription, title, description, urlOverride,
            className, imageUrl, productsId, categoriesId, priority, timestamp, changed,
            status, product, category, disallowedParents,
        } = this.props;
        const {showEditor, editorField} = this.state;
        const btnEnabled = {
            'btn-success': !!status,
            'btn-outline-success': !status,
            'mr-1': true
        };
        const btnDisabled = {
            'btn-danger': !status,
            'btn-outline-danger': !!status,
        };

        const imagePlaceholder = product.image
            ? parseImageFilename({
                image: product.image || '',
                colorCode: product.defaultColor || ''
            })
            : '';

        if (!category.id) {
            return (
                <div>
                    <h4>Edit Item</h4>
                    <Alert message="You must first select (or save) a category."/>
                </div>
            )
        }

        const imageHelpText = itemType === ITEM_TYPES.link
            ? 'Full path, eg. /images/pages/35th-video-lg.jpg'
            : 'Relative to /images/products/:size/';

        return (
            <Fragment>
                <div className="sticky-50">
                    <h4>Edit Item</h4>
                    <form onSubmit={this.onSubmit}>
                        <FormGroup label="ID / Status" colWidth={8}>
                            <div className="form-row">
                                <div className="col-6">
                                    <TextInput value={id || 'new item'} readOnly/>
                                </div>
                                <div className="col-6">
                                    <button type="button" className={classNames('btn btn-sm', btnEnabled)}
                                            onClick={this.onSetEnabled}>Enabled
                                    </button>
                                    <button type="button" className={classNames('btn btn-sm', btnDisabled)}
                                            onClick={this.onSetDisabled}>Disabled
                                    </button>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup colWidth={8} label="Item Type">
                            <div className="btn-group btn-group-sm item-types">
                                <Button field="itemType" value={ITEM_TYPES.section}
                                        className={classNames('section', buttonClassName(itemType === ITEM_TYPES.section))}
                                        text="Section" onClick={this.onChangeItemType}/>
                                <Button field="itemType" value={ITEM_TYPES.product}
                                        className={classNames('product', buttonClassName(itemType === ITEM_TYPES.product))}
                                        text="Product" onClick={this.onChangeItemType}/>
                                <Button field="itemType" value={ITEM_TYPES.category}
                                        className={classNames('category', buttonClassName(itemType === ITEM_TYPES.category))}
                                        text="Category" onClick={this.onChangeItemType}/>
                                <Button field="itemType" value={ITEM_TYPES.link}
                                        className={classNames('link', buttonClassName(itemType === ITEM_TYPES.link))}
                                        text="Link" onClick={this.onChangeItemType}/>
                            </div>
                        </FormGroup>
                        {itemType === ITEM_TYPES.section && (
                            <Fragment>
                                <FormGroupTextInput colWidth={8} label="Section Title" value={sectionTitle}
                                                    field="sectionTitle" onChange={this.onChange} required/>
                                <FormGroup colWidth={8} label="Section Description">
                                    <ControlledTextArea value={sectionDescription} field="sectionDescription"
                                                        onChange={this.onChange}/>
                                </FormGroup>
                            </Fragment>
                        )}
                        {itemType !== ITEM_TYPES.section && itemType !== ITEM_TYPES.other && (
                            <FormGroupTextInput colWidth={8} label="Title" value={title} field="title"
                                                onChange={this.onChange} required/>
                        )}
                        {itemType === ITEM_TYPES.product && (
                            <FormGroup colWidth={8} label="Product">
                                <ProductSelect value={productsId} field="productsId" onChange={this.onChange} required/>
                            </FormGroup>
                        )}
                        {itemType === ITEM_TYPES.product && (
                            <ProductInactiveAlert id={productsId}/>
                        )}
                        {itemType === ITEM_TYPES.category && (
                            <FormGroup colWidth={8} label="Category">
                                <CategorySelect value={categoriesId} field="categoriesId" onChange={this.onChange}
                                                disallow={disallowedParents} required/>
                            </FormGroup>
                        )}
                        {itemType === ITEM_TYPES.category && (
                            <CategoryInactiveAlert id={categoriesId}/>
                        )}
                        {itemType !== ITEM_TYPES.section && itemType !== ITEM_TYPES.other && (
                            <FormGroup colWidth={8} label="Description">
                                <div className="input-group input-group-sm">
                                    <ControlledTextArea value={description} field="description"
                                                        onChange={this.onChange}/>
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-outline-secondary"
                                                onClick={this.onClickEditDescription}>
                                            <span className="material-icons">code</span>
                                        </button>
                                    </div>
                                </div>
                            </FormGroup>
                        )}
                        {itemType !== ITEM_TYPES.other && (
                            <FormGroupTextInput colWidth={8} label="Image Filename"
                                                value={imageUrl} field="imageUrl" onChange={this.onChange}
                                                placeholder={imagePlaceholder}
                                                helpText={imageHelpText}/>
                        )}
                        {itemType !== ITEM_TYPES.other && (
                            <FormGroupTextInput colWidth={8} label="Item ClassName"
                                                value={className} field="className" onChange={this.onChange}/>
                        )}
                        {itemType !== ITEM_TYPES.other && (
                            <FormGroupTextInput colWidth={8} label="Link To" value={urlOverride}
                                                field="urlOverride"
                                                required={itemType === ITEM_TYPES.link}
                                                onChange={this.onChange}
                                                helpText="If outside of domain, make sure to include 'https://'"/>
                        )}
                        {itemType === ITEM_TYPES.other && (
                            <Alert type="warning">Pick an item or an item type.</Alert>
                        )}
                        <FormGroup colWidth={8} label={' '}>
                            <Button type="submit" text="Save"
                                    disabled={itemType === ITEM_TYPES.other}
                                    className="btn btn-sm btn-primary mr-1"/>
                            <Button type="button" onClick={this.onNewItem} text="New Item"
                                    className="btn btn-sm btn-outline-secondary mr-1"/>
                            <Button type="button" onClick={this.onDeleteItem} text="Delete"
                                    className="btn btn-sm btn-outline-danger mr-1" disabled={id === 0}/>
                        </FormGroup>
                        {changed && <Alert message="Don't forget to save."/>}
                    </form>
                </div>
                {showEditor && <ModalEditor field={editorField} value={this.props[editorField]}
                                            onChange={this.onChange} onClose={this.onCloseEditor}/>}
            </Fragment>
        );
    }
}

const mapStateToProps = ({item, loadingItem, category, categories}) => {
    const disallowedParents = calcParentIds(categories, category.id);
    return {...item, loadingItem, category, disallowedParents};
};

const mapDispatchToProps = {
    updateItem,
    saveCategoryItem,
    deleteCategoryItem,
    createNewItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor) 
