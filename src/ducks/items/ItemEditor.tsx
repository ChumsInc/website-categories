import React, {FormEvent, Fragment, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from "classnames";
import {deleteCategoryItemAction, saveCategoryItemAction, selectItemAction, updateItemAction} from "./actions";
import {itemTypes, selectedItemSelector} from "./index";
import {FieldInput, FieldTextArea, FormColumn} from "chums-ducks/dist/components";
import {defaultItem, InputField, Keyword} from "../types";
import InactiveKeywordAlert from "../keywords/InactiveKeywordAlert";
import ProductSelect from "../keywords/ProductSelect";
import CategorySelect from "../categories/CategorySelect";
import {disallowedParentsSelector} from "../categories";
import ModalEditor from "../../components/ModalEditor";
import {setModalEditorAction} from "../modal-editor";
import {Alert} from "chums-ducks/dist/ducks";
import Button from "./Button";

type EditorField = 'sectionDescription' | 'description';

const buttonClassName = (state: boolean) => {
    return {
        'btn btn-sm': true,
        'btn-outline-secondary': !state,
        'btn-secondary': state
    };
};

const activeButtonClassName = (state: boolean, defaultState: boolean = false) => {
    return {
        'btn btn-sm': true,
        'btn-outline-success': !state && defaultState,
        'btn-success': state && defaultState,
        'btn-outline-danger': !defaultState && state,
        'btn-danger': !defaultState && !state,
    };
};

const ItemEditor: React.FC = () => {
    const dispatch = useDispatch();
    const item = useSelector(selectedItemSelector);
    const disallowedParents = useSelector(disallowedParentsSelector);
    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState('description' as EditorField);

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        dispatch(saveCategoryItemAction());
    }

    const changeHandler = ({field, value}: InputField) => {
        dispatch(updateItemAction({[field]: value}));
    }

    const keywordChangeHandler = (field: string, keyword?: Keyword) => {
        changeHandler({field, value: keyword?.id || 0})
    }

    const onClickEdit = (field: EditorField) => {
        dispatch(setModalEditorAction(`Item.${field}`, item[field] || ''));
        setEditorField(field);
        setShowEditor(true);
    }

    const onCloseEditor = (value: string) => {
        changeHandler({field: editorField, value});
        setShowEditor(false);
    }

    const onCancelEditor = () => {
        setShowEditor(false);
    }

    const onNewItem = () => {
        if (item.changed && !window.confirm('Are you sure you want to lose your current changes?')) {
            return;
        }
        dispatch(selectItemAction(defaultItem));
    }

    const onDeleteItem = () => {
        if (!window.confirm(`Are you sure you want to delete item ${item.title}?`)) {
            return;
        }
        dispatch(deleteCategoryItemAction());
    }

    const {
        id,
        itemType,
        status,
        sectionTitle,
        sectionDescription,
        title,
        description,
        productsId,
        categoriesId,
        product,
        imageUrl,
        className,
        urlOverride,
        priority,
        parentId,
        category,
        changed,
    } = item;

    const imageHelpText = itemType === itemTypes.link
        ? 'Full path, eg. /images/pages/35th-video-lg.jpg'
        : 'Relative to /images/products/:size/';


    return (
        <Fragment>
            <div className="sticky-50">
                <h4>Edit Item</h4>
                <form onSubmit={onSubmit}>
                    <FormColumn label="ID / Status" width={8}>
                        <div className="row g-3">
                            <div className="col-auto">
                                <FieldInput value={id || 'new item'} readOnly/>
                            </div>
                            <div className="col">
                                <div className="btn-group btn-group-sm">
                                    <button type="button" className={classNames('btn btn-sm', {
                                        'btn-outline-success': !status,
                                        'btn-success': status
                                    })}
                                            onClick={() => changeHandler({field: 'status', value: 1})}>
                                        Enabled
                                    </button>
                                    <button type="button" className={classNames('btn btn-sm', {
                                        'btn-outline-danger': status,
                                        'btn-danger': !status
                                    })}
                                            onClick={() => changeHandler({field: 'status', value: 0})}>
                                        Disabled
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn width={8} label="Item Type">
                        <div className="btn-group btn-group-sm item-types">
                            <button type="button"
                                    onClick={() => changeHandler({field: 'itemType', value: itemTypes.section})}
                                    className={classNames('section', buttonClassName(itemType === itemTypes.section))}>
                                Section
                            </button>

                            <button type="button"
                                    onClick={() => changeHandler({field: 'itemType', value: itemTypes.product})}
                                    className={classNames('product', buttonClassName(itemType === itemTypes.product))}>
                                Product
                            </button>
                            <button type="button"
                                    onClick={() => changeHandler({field: 'itemType', value: itemTypes.category})}
                                    className={classNames('category', buttonClassName(itemType === itemTypes.category))}>
                                Category
                            </button>
                            <button type="button"
                                    onClick={() => changeHandler({field: 'itemType', value: itemTypes.link})}
                                    className={classNames('link', buttonClassName(itemType === itemTypes.link))}>
                                Link
                            </button>
                        </div>
                    </FormColumn>
                    {itemType === itemTypes.section && (
                        <Fragment>
                            <FormColumn label="Section Title" width={8}>
                                <FieldInput field="sectionTitle" value={sectionTitle} onChange={changeHandler}/>
                            </FormColumn>
                            <FormColumn label="Section Description" width={8}>
                                <FieldInput field="sectionDescription" value={sectionDescription}
                                            onChange={changeHandler}/>
                            </FormColumn>
                        </Fragment>
                    )}
                    {itemType !== itemTypes.section && itemType !== itemTypes.other && (
                        <FormColumn label="Title" width={8}>
                            <FieldInput field="title" value={title} onChange={changeHandler}/>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.product && (
                        <FormColumn width={8} label="Product">
                            <ProductSelect value={productsId} required
                                           onChange={(keyword?: Keyword) => keywordChangeHandler('productsId', keyword)}/>
                        </FormColumn>
                    )}
                    {product?.keyword && (
                        <InactiveKeywordAlert keyword={product?.keyword}/>
                    )}
                    {itemType === itemTypes.category && (
                        <FormColumn width={8} label="Category">
                            <CategorySelect value={categoriesId}
                                            onChange={(ev) => changeHandler({
                                                field: 'categoriesId',
                                                value: ev.target.value
                                            })}
                                            disallow={disallowedParents} required/>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.category && (
                        <InactiveKeywordAlert id={categoriesId} itemType={itemType}/>
                    )}
                    {itemType !== itemTypes.section && itemType !== itemTypes.other && (
                        <FormColumn width={8} label="Description">
                            <div className="input-group input-group-sm">
                                <FieldTextArea value={description} field="description"
                                               onChange={changeHandler}/>
                                <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => onClickEdit('description')}>
                                    <span className="material-icons">code</span>
                                </button>
                            </div>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.other && (
                        <FormColumn label="Image Filename" width={8}>
                            <FieldInput field="imageUrl" value={imageUrl} onChange={changeHandler}/>
                            <small>{imageHelpText}</small>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.other && (
                        <FormColumn label="Item Classname" width={8}>
                            <FieldInput value={className} field="className" onChange={changeHandler}/>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.other && (
                        <FormColumn label="Link To">
                            <FieldInput value={urlOverride}
                                        field="urlOverride"
                                        required={itemType === itemTypes.link}
                                        onChange={changeHandler}
                            />
                            <small>If outside of domain, make sure to include 'https://'</small>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.other && (
                        <Alert color="warning">Pick an item or an item type.</Alert>
                    )}
                    <FormColumn width={8} label={' '}>
                        <Button type="submit" disabled={itemType === itemTypes.other || !parentId}
                                className="btn btn-sm btn-primary me-1">Save</Button>
                        <Button type="button" onClick={onNewItem} disabled={!parentId}
                                className="btn btn-sm btn-outline-secondary me-1">New Item</Button>
                        <Button type="button" onClick={onDeleteItem}
                                className="btn btn-sm btn-outline-danger me-1" disabled={id === 0}>Delete</Button>
                    </FormColumn>
                    {changed && <Alert message="Don't forget to save."/>}
                </form>
            </div>
            {showEditor && <ModalEditor title={`Edit '${editorField}'`} content={item[editorField] || ''}
                                        onClose={onCloseEditor} onCancel={onCancelEditor}/>}
        </Fragment>
    )
}

export default ItemEditor;
