import React, {ChangeEvent, FormEvent, Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
import {deleteCurrentItem, saveCurrentItem, setCurrentItem, updateCurrentItem} from "./actions";
import {itemTypes} from "./index";
import {Alert, FormColumn} from "chums-components";
import {CategoryItem, defaultItem, InputField} from "../types";
import ProductSelect from "../keywords/ProductSelect";
import CategorySelect from "../categories/CategorySelect";
import {selectCurrentCategory, selectDisallowedParents} from "../categories/selectors";
import ModalEditor from "../../components/ModalEditor";
import StatusButton from "../../components/StatusButton";
import ItemTypeButtonSet from "./ItemTypeButtonSet";
import {useAppDispatch} from "../../app/configureStore";
import {selectCurrentItem} from "./selectors";
import {isCategoryChildCategory, isCategoryChildLink, isCategoryChildProduct, isCategoryChildSection} from "./utils";
import {TextareaAutosize} from "@mui/base";
import {Keyword, ProductCategoryChild} from "b2b-types";
import UsageByKeyword from "../usage/UsageByKeyword";
import classNames from "classnames";
import ProductImage from "./ProductImage";

type EditorField = keyof Pick<ProductCategoryChild, 'sectionDescription' | 'description'>;

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const category = useSelector(selectCurrentCategory);
    const item = useSelector(selectCurrentItem);
    const disallowedParents = useSelector(selectDisallowedParents);
    const [editorField, setEditorField] = useState<EditorField | null>(null);

    const onChangeStatus = (status: boolean) => valueChangeHandler({field: 'status', value: status});

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!item) {
            return;
        }
        dispatch(saveCurrentItem(item));
    }

    const changeHandler = (field: keyof CategoryItem) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'className':
            case 'imageUrl':
            case 'sectionTitle':
            case 'title':
            case 'urlOverride':
                dispatch(updateCurrentItem({[field]: ev.target.value}));
                return;
        }
    }

    const textareaChangeHandler = (field: keyof CategoryItem) => (ev: ChangeEvent<HTMLTextAreaElement>) => {
        switch (field) {
            case 'description':
            case 'sectionDescription':
                dispatch(updateCurrentItem({[field]: ev.target.value}));
                return;
        }
    }


    const valueChangeHandler = ({field, value}: InputField) => {
        dispatch(updateCurrentItem({[field]: value}));
    }

    const keywordChangeHandler = (field: keyof CategoryItem) => (keyword?: Keyword) => {
        if (!item) {
            return;
        }
        dispatch(updateCurrentItem({[field]: keyword?.id ?? 0}))
    }

    const onCloseEditor = (value: string) => {
        if (!editorField || !item) {
            return;
        }
        dispatch(updateCurrentItem({[editorField]: value}));
        setEditorField(null);
    }

    const onCancelEditor = () => {
        setEditorField(null);
    }

    const onNewItem = () => {
        if (!category) {
            return null;
        }
        if (item?.changed && !window.confirm('Are you sure you want to lose your current changes?')) {
            return;
        }
        dispatch(setCurrentItem({...defaultItem, parentId: category?.id}));
    }

    const onDeleteItem = () => {
        if (!item || item.id === 0) {
            return;
        }
        if (!window.confirm(`Are you sure you want to delete item ${item.title}?`)) {
            return;
        }
        dispatch(deleteCurrentItem(item));
    }

    const imageHelpText = item?.itemType === itemTypes.link
        ? 'Full path, eg. /images/pages/35th-video-lg.jpg'
        : 'Relative to /images/products/:size/';


    if (!category?.id) {
        return null;
    }

    if (!item) {
        return (
            <div className="row g-3">
                <div className="col">
                    <Alert color="info">Select an Item</Alert>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onNewItem}>
                        New Item
                    </button>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            <div className="sticky-50">
                <h4>Edit Item</h4>
                <hr/>
                <form onSubmit={onSubmit}>
                    <FormColumn label="ID / Status" width={8}>
                        <div className="row g-3">
                            <div className="col">
                                <input type="text" value={item?.id || 'new'} className="form-control form-control-sm"
                                       readOnly/>
                            </div>
                            <div className="col">
                                <StatusButton status={!!item?.status} onChange={onChangeStatus}/>
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn width={8} label="Item Type">
                        <ItemTypeButtonSet/>
                    </FormColumn>
                    {isCategoryChildSection(item) && (
                        <>
                            <FormColumn label="Section Title" width={8}>
                                <input type="text" value={item.sectionTitle} onChange={changeHandler('sectionTitle')}
                                       className="form-control form-control-sm"/>
                            </FormColumn>
                            <FormColumn label="Section Description" width={8}>
                                <div className="input-group input-group-sm">
                                    <TextareaAutosize className="form-control form-control-sm" maxRows={5}
                                                      value={item.sectionDescription}
                                                      onChange={textareaChangeHandler('sectionDescription')}/>
                                    <button type="button" className="btn btn-sm btn-ouline-secondary"
                                            onClick={() => setEditorField('sectionDescription')}>
                                        <span className="bi-code-slash"/>
                                    </button>
                                </div>
                            </FormColumn>
                        </>
                    )}
                    {!isCategoryChildSection(item) && (
                        <FormColumn label="Title" width={8}>
                            <input type="text" value={item.title} onChange={changeHandler('title')}
                                   className="form-control form-control-sm"/>
                        </FormColumn>
                    )}
                    {isCategoryChildProduct(item) && (
                        <FormColumn width={8} label="Product">
                            <div className="input-group input-group-sm">
                                <div
                                    className={classNames("input-group-text text-light", {'bg-danger': !item.product?.status, 'bg-success': !!item.product?.status})}>
                                    {!!item.product?.status && <span className="bi-bag-check-fill"/>}
                                    {!item.product?.status && <span className="bi-x-lg"/>}
                                </div>
                                <ProductSelect value={item.productsId} required
                                               onChange={keywordChangeHandler('productsId')}/>
                            </div>
                        </FormColumn>
                    )}
                    {isCategoryChildCategory(item) && (
                        <FormColumn width={8} label="Category">
                            <div className="input-group input-group-sm">
                                <div
                                    className={classNames("input-group-text text-light", {'bg-danger': !item.category?.status, 'bg-success': !!item.category?.status})}>
                                    {!!item.category?.status && <span className="bi-bag-check-fill"/>}
                                    {!item.category?.status && <span className="bi-x-lg"/>}
                                </div>
                                <CategorySelect value={item.categoriesId}
                                                onChange={(ev) => valueChangeHandler({
                                                    field: 'categoriesId',
                                                    value: ev.target.value
                                                })}
                                                disallow={disallowedParents} required/>
                            </div>
                        </FormColumn>
                    )}
                    {!isCategoryChildSection(item) && (
                        <FormColumn width={8} label="Description">
                            <div className="input-group input-group-sm">
                                <TextareaAutosize value={item.description}
                                                  onChange={textareaChangeHandler('description')}
                                                  className="form-control form-control-sm"/>
                                <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => setEditorField('description')}>
                                    <span className="bi-code-slash"/>
                                </button>
                            </div>
                        </FormColumn>
                    )}
                    <FormColumn label="Image Filename" width={8}>
                        <input type="text" value={item.imageUrl ?? ''} onChange={changeHandler('imageUrl')}
                               className="form-control form-control-sm"/>
                        <small>{imageHelpText}</small>
                    </FormColumn>
                    <FormColumn label="Item Classname" width={8}>
                        <input type="text" value={item.className ?? ''} onChange={changeHandler('className')}
                               className="form-control form-control-sm"/>
                    </FormColumn>
                    <FormColumn label="Link To">
                        <input type="text" value={item.urlOverride ?? ''} onChange={changeHandler('urlOverride')}
                               className="form-control form-control-sm" required={isCategoryChildLink(item)}/>
                        <small>If outside of domain, make sure to include 'https://'</small>
                    </FormColumn>
                    <FormColumn width={8} label={' '}>
                        <div className="row g-3">
                            <div className="col-auto">
                                <button type="submit" disabled={!item.parentId} className="btn btn-sm btn-primary">
                                    Save
                                </button>
                            </div>
                            <div className="col-auto">
                                <button type="button" onClick={onNewItem} disabled={!item.parentId}
                                        className="btn btn-sm btn-outline-secondary">
                                    New Item
                                </button>
                            </div>
                            <div className="col-auto">
                                <button type="button" onClick={onDeleteItem}
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={item.id === 0}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </FormColumn>
                    {item.changed && <Alert color="warning" message="Don't forget to save."/>}
                </form>
            </div>
            <hr />
            <div className="my-3">
                {isCategoryChildProduct(item) &&
                    <ProductImage image={item.product?.image} defaultColor={item.product?.defaultColor}
                                  imageUrl={item.imageUrl}/>}
                {isCategoryChildCategory(item) && <ProductImage imageUrl={item.imageUrl}/>}
                {isCategoryChildLink(item) && !!item.imageUrl && <ProductImage imageUrl={item.imageUrl}/>}
            </div>
            <hr />
            {isCategoryChildProduct(item) && <UsageByKeyword keyword={item.product?.keyword}/>}
            {isCategoryChildCategory(item) && <UsageByKeyword keyword={item.category?.keyword}/>}
            {!!editorField && <ModalEditor title={`Edit '${editorField}'`}
                                           content={item[editorField] || ''}
                                           onClose={onCloseEditor} onCancel={onCancelEditor}/>}
        </Fragment>
    )
}

export default ItemEditor;
