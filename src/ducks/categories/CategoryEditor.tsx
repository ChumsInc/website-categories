import React, {ChangeEvent, FormEvent, Fragment, useState} from 'react';
import {useSelector} from 'react-redux';
import ModalEditor from "../../components/ModalEditor";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import CategorySelect from "./CategorySelect";
import AlertExistingKeyword from "../keywords/AlertExistingKeyword";
import {selectChildCategories, selectCurrentCategory} from "./selectors";
import {defaultCategory} from "../types";
import SEOChangeFreqSelect from "./SEOChangeFreqSelect";
import SEOPrioritySelect from "./SEOPrioritySelect";
import StatusButton from "../../components/StatusButton";
import {saveCategory, updateCategory} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import {ProductCategory} from "b2b-types";
import {TextareaAutosize} from "@mui/base";
import UsageByKeyword from "../usage/UsageByKeyword";
import PreviewLink from "./PreviewLink";

type EditorField = keyof Pick<ProductCategory, 'pageText' | 'descriptionMeta'>;

interface CategoryEditorProps {

}

const CategoryEditor: React.FC<CategoryEditorProps> = ({}) => {
    const dispatch = useAppDispatch();
    const category = useSelector(selectCurrentCategory);
    const disallowedChildIds = useSelector(selectChildCategories);
    const [editorField, setEditorField] = useState<EditorField | null>(null);

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!category) {
            return;
        }
        dispatch(saveCategory(category));
    }

    const valueChangeHandler = (field: keyof ProductCategory) => (value: any) => {
        if (category?.[field] === value) {
            return;
        }
        dispatch(updateCategory({[field]: value}));
    }

    const inputChangeHandler = (field: keyof ProductCategory) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'children':
            case 'timestamp':
                return;
            case 'status':
                return dispatch(updateCategory({[field]: ev.target.checked}));
            default:
                return dispatch(updateCategory({[field]: ev.target.value}));
        }
    }

    const textareaChangeHandler = (field: keyof ProductCategory) => (ev: ChangeEvent<HTMLTextAreaElement>) => {
        switch (field) {
            case 'pageText':
            case 'descriptionMeta':
                return dispatch(updateCategory({[field]: ev.target.value}));
        }
    }

    const onCloseEditor = (value: string) => {
        if (!category || !editorField) {
            return;
        }
        valueChangeHandler(editorField)(value);
        setEditorField(null);
    }

    const onCancelEditor = () => {
        setEditorField(null)
    }

    const onNewCategory = () => {
        dispatch(updateCategory({...defaultCategory}));
    }

    const onDeleteCategory = () => {
        if (!category || !category.id && window.confirm(`Are you sure your want to delete category '${category.keyword}'`)) {
            // dispatch(deleteC)
        }
    }

    return (
        <Fragment>
            <div className="sticky-50">
                <div className="row g-3">
                    <div className="col">
                        <h4>Edit</h4>
                    </div>
                    <div className="col-auto">
                        <PreviewLink/>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="my-3">
                    <FormColumn label="ID / Keyword" width={8}>
                        <div className="input-group input-group-sm">
                            <div className="input-group-text">{category?.id || 'new'}</div>
                            <input type="text" className="form-control form-control-sm"
                                   value={category?.keyword ?? ''} onChange={inputChangeHandler('keyword')} required/>
                        </div>
                        <AlertExistingKeyword keyword={category?.keyword ?? ''} id={category?.id ?? 0}
                                              pageType="category"/>
                    </FormColumn>
                    <FormColumn width={8} label="Status">
                        <StatusButton status={!!category?.status} onChange={valueChangeHandler('status')}/>
                    </FormColumn>
                    <FormColumn label="Title" width={8}>
                        <input type="text" className="form-control form-control-sm" value={category?.title ?? ''}
                               onChange={inputChangeHandler('title')}
                               placeholder="Title" required/>
                    </FormColumn>
                    <FormColumn width={8} label="Parent Category">
                        <CategorySelect value={(category?.parentId === null ? '' : category?.parentId) ?? ''}
                                        required={true}
                                        disallow={disallowedChildIds}
                                        onChange={(ev) => valueChangeHandler('parentId')(Number(ev.target.value))}/>
                    </FormColumn>
                    <FormColumn label="Lifestyle Image" width={8}>
                        <input type="text" className="form-control form-control-sm" value={category?.lifestyle ?? ''}
                               onChange={inputChangeHandler('lifestyle')}
                               placeholder="Lifestyle Image"/>
                    </FormColumn>
                    <FormColumn label="Page CSS File" width={8}>
                        <input type="text" className="form-control form-control-sm" value={category?.css ?? ''}
                               onChange={inputChangeHandler('css')}
                               placeholder="CSS Filename"/>
                    </FormColumn>
                    <FormColumn label="Text" width={8}>
                        <div className="input-group input-group-sm">
                            <TextareaAutosize className="form-control form-control-sm mb-1"
                                              value={category?.pageText ?? ''}
                                              onChange={textareaChangeHandler('pageText')} maxRows={5}/>
                            <button type="button" className="btn btn-outline-secondary"
                                    onClick={() => setEditorField('pageText')}>
                                <span className="bi-code-slash"/>
                            </button>
                        </div>
                    </FormColumn>
                    <FormColumn label="SEO Description" width={8}>
                        <TextareaAutosize className="form-control form-control-sm mb-1"
                                          value={category?.descriptionMeta ?? ''}
                                          onChange={textareaChangeHandler('descriptionMeta')} maxRows={5}/>
                    </FormColumn>

                    <FormColumn width={8} label="SEO Changes / Priority">
                        <div className="row g-3">
                            <div className="col-6">
                                <SEOChangeFreqSelect value={category?.changefreq || ''}
                                                     onChange={valueChangeHandler('changefreq')}
                                                     required={true}/>
                            </div>
                            <div className="col-6">
                                <SEOPrioritySelect value={category?.priority || 0}
                                                   onChange={valueChangeHandler('priority')}/>
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn width={8} label={' '} className="mt-1">
                        <div className="row g-3">
                            <div className="col-auto">
                                <SpinnerButton type="submit" size="sm" color="primary"
                                               title={'last saved: ' + category?.timestamp}>
                                    Save
                                </SpinnerButton>
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                        onClick={onNewCategory}>
                                    New Category
                                </button>
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-sm btn-outline-danger me-1"
                                        onClick={onDeleteCategory}
                                        disabled={!category || !category?.id || category?.children?.length > 0}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </FormColumn>
                    {category?.changed && <Alert color="warning" message="Don't forget to save your changes"/>}
                </form>
            </div>
            <div className="my-3">
                <UsageByKeyword keyword={category?.keyword}/>
            </div>
            {!!category && !!editorField &&
                <ModalEditor title={`Edit '${editorField}'`} content={String(category[editorField]) || ''}
                             onClose={onCloseEditor} onCancel={onCancelEditor}/>}
        </Fragment>
    )
}

export default CategoryEditor;
