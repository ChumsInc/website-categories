import React, {FormEvent, Fragment, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from "classnames";
import {deleteCategoryItemAction, saveCategoryItemAction, selectItemAction, updateItemAction} from "./actions";
import {itemTypes, selectCurrentItem} from "./index";
import {FieldInput, FieldTextArea, FormColumn} from "chums-ducks/dist/components";
import {defaultItem, InputField, Keyword} from "../types";
import InactiveKeywordAlert from "../keywords/InactiveKeywordAlert";
import ProductSelect from "../keywords/ProductSelect";
import CategorySelect from "../categories/CategorySelect";
import {disallowedParentsSelector, selectCurrentCategory} from "../categories";
import ModalEditor from "../../components/ModalEditor";
import {setModalEditorAction} from "../modal-editor";
import {Alert} from "chums-ducks/dist/ducks";
import StatusButton from "../../components/StatusButton";
import ItemTypeButtonSet from "./ItemTypeButtonSet";
import {InputGroup} from "chums-ducks";

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
    const category = useSelector(selectCurrentCategory);
    const item = useSelector(selectCurrentItem);
    const disallowedParents = useSelector(disallowedParentsSelector);
    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState('description' as EditorField);

    const onChangeStatus = (status:boolean) => changeHandler({field: 'status', value: status});

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
        dispatch(selectItemAction({...defaultItem, parentId: category.id}));
    }

    const onDeleteItem = () => {
        if (!window.confirm(`Are you sure you want to delete item ${item.title}?`)) {
            return;
        }
        dispatch(deleteCategoryItemAction());
    }

    const {itemType} = item;

    const imageHelpText = itemType === itemTypes.link
        ? 'Full path, eg. /images/pages/35th-video-lg.jpg'
        : 'Relative to /images/products/:size/';


    if (!category.id) {
        return (
            <Alert color="info">Please select (or save) a category first.</Alert>
        )
    }
    return (
        <Fragment>
            <div className="sticky-50">
                <h4>Edit Item</h4>
                <hr />
                <form onSubmit={onSubmit}>
                    <FormColumn label="ID / Status" width={8}>
                        <div className="row g-3">
                            <div className="col">
                                <FieldInput value={item.id || 'new'} readOnly/>
                            </div>
                            <div className="col">
                                <StatusButton status={!!item.status} onChange={onChangeStatus} />
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn width={8} label="Item Type">
                        <ItemTypeButtonSet />
                    </FormColumn>
                    {itemType === itemTypes.section && (
                        <Fragment>
                            <FormColumn label="Section Title" width={8}>
                                <FieldInput field="sectionTitle" value={item.sectionTitle} onChange={changeHandler}/>
                            </FormColumn>
                            <FormColumn label="Section Description" width={8}>
                                <FieldInput field="sectionDescription" value={item.sectionDescription}
                                            onChange={changeHandler}/>
                            </FormColumn>
                        </Fragment>
                    )}
                    {itemType !== itemTypes.section && itemType !== itemTypes.html && (
                        <FormColumn label="Title" width={8}>
                            <FieldInput field="title" value={item.title} onChange={changeHandler}/>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.product && (
                        <FormColumn width={8} label="Product">
                            <ProductSelect value={item.productsId} required
                                           onChange={(keyword?: Keyword) => keywordChangeHandler('productsId', keyword)}/>
                        </FormColumn>
                    )}
                    {item.product?.keyword && (
                        <InactiveKeywordAlert keyword={item.product?.keyword}/>
                    )}
                    {itemType === itemTypes.category && (
                        <FormColumn width={8} label="Category">
                            <CategorySelect value={item.categoriesId}
                                            onChange={(ev) => changeHandler({
                                                field: 'categoriesId',
                                                value: ev.target.value
                                            })}
                                            disallow={disallowedParents} required/>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.category && (
                        <InactiveKeywordAlert id={item.categoriesId} itemType={itemType}/>
                    )}
                    {itemType !== itemTypes.section && itemType !== itemTypes.html && (
                        <FormColumn width={8} label="Description">
                            <div className="input-group input-group-sm">
                                <FieldTextArea value={item.description} field="description"
                                               onChange={changeHandler}/>
                                <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => onClickEdit('description')}>
                                    <span className="material-icons">code</span>
                                </button>
                            </div>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.html && (
                        <FormColumn label="Image Filename" width={8}>
                            <FieldInput field="imageUrl" value={item.imageUrl} onChange={changeHandler}/>
                            <small>{imageHelpText}</small>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.html && (
                        <FormColumn label="Item Classname" width={8}>
                            <FieldInput value={item.className} field="className" onChange={changeHandler}/>
                        </FormColumn>
                    )}
                    {itemType !== itemTypes.html && (
                        <FormColumn label="Link To">
                            <FieldInput value={item.urlOverride}
                                        field="urlOverride"
                                        required={itemType === itemTypes.link}
                                        onChange={changeHandler}
                            />
                            <small>If outside of domain, make sure to include 'https://'</small>
                        </FormColumn>
                    )}
                    {itemType === itemTypes.html && (
                        <Alert color="warning">Pick an item or an item type.</Alert>
                    )}
                    <FormColumn width={8} label={' '}>
                        <button type="submit" disabled={!item.parentId} className="btn btn-sm btn-primary me-1">
                            Save
                        </button>
                        <button type="button" onClick={onNewItem} disabled={!item.parentId}
                                className="btn btn-sm btn-outline-secondary me-1">
                            New Item
                        </button>
                        <button type="button" onClick={onDeleteItem}
                                className="btn btn-sm btn-outline-danger me-1" disabled={item.id === 0}>
                            Delete
                        </button>
                    </FormColumn>
                    {item.changed && <Alert message="Don't forget to save."/>}
                </form>
            </div>
            {showEditor && <ModalEditor title={`Edit '${editorField}'`} content={item[editorField] || ''}
                                        onClose={onCloseEditor} onCancel={onCancelEditor}/>}
        </Fragment>
    )
}

export default ItemEditor;
