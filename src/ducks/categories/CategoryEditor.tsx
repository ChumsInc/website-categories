import React, {FormEvent, Fragment, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import classNames from 'classnames';
import ModalEditor from "../../components/ModalEditor";
import {Alert} from "chums-ducks/dist/ducks";
import {FieldInput, FieldTextArea, FormColumn, Progress, ProgressBar} from "chums-ducks/dist/components";
import CategorySelect from "./CategorySelect";
import AlertExistingKeyword from "../keywords/AlertExistingKeyword";
import {childCategoriesSelector, loadingSelector, selectedCategorySelector} from "./index";
import {currentSiteSelector} from "../sites";
import {Category, defaultCategory, InputField} from "../types";
import {changeCategoryAction, saveCategoryAction, selectCategoryAction} from "./actions";
import SEOChangeFreqSelect from "./SEOChangeFreqSelect";
import SEOPrioritySelect from "./SEOPrioritySelect";
import {previewURL} from "./utils";
import {setModalEditorAction} from "../modal-editor";

type EditorField = keyof Category;

interface CategoryEditorProps {

}

const CategoryEditor: React.FC<CategoryEditorProps> = ({}) => {
    const dispatch = useDispatch();
    const category = useSelector(selectedCategorySelector);
    const {
        id,
        keyword,
        status,
        css,
        priority,
        lifestyle,
        title,
        changefreq,
        descriptionMeta,
        pageText,
        parentId,
        timestamp,
        children: items,
        changed
    } = category;
    const site = useSelector(currentSiteSelector);
    const disallowedChildIds = useSelector(childCategoriesSelector);
    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState('pageText' as EditorField);
    const loading = useSelector(loadingSelector);

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCategoryAction(category));
    }

    const changeHandler = ({field, value}: InputField) => {
        dispatch(changeCategoryAction({[field]: value}));
    }

    const onSetEnabled = () => changeHandler({field: 'status', value: true});
    const onSetDisabled = () => changeHandler({field: 'status', value: false});

    const onClickEdit = (field: keyof Category) => {
        dispatch(setModalEditorAction('Category Text', category[field] || ''));
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

    const btnEnabled = {
        'btn-success': !!status,
        'btn-outline-success': !status,
        'mr-1': true
    };
    const btnDisabled = {
        'btn-danger': !status,
        'btn-outline-danger': !!status,
    };

    const onNewCategory = () => {
        dispatch(selectCategoryAction(defaultCategory));
    }

    const onDeleteCategory = () => {

    }

    return (
        <Fragment>
            <div className="sticky-50">
                <h4>Edit{' '}
                    {!!keyword && (
                        <small>
                            (<a href={previewURL(site, keyword)}
                                target="_blank">preview{!status ? ' in dev mode' : ''}</a>)
                        </small>)}
                </h4>
                <form onSubmit={onSubmit} className="my-3">
                    <FormColumn label="ID / Keyword" width={8}>
                        <div className="input-group input-group-sm">
                            <div className="input-group-text">{id || 'new'}</div>
                            <FieldInput value={keyword || ''} field="keyword" onChange={changeHandler} required/>
                        </div>
                        <AlertExistingKeyword keyword={keyword} id={id} pageType="category"/>
                    </FormColumn>
                    <FormColumn width={8} label="Status">
                        <button type="button" className={classNames('btn btn-sm me-1', btnEnabled)}
                                onClick={onSetEnabled}>Enabled
                        </button>
                        <button type="button" className={classNames('btn btn-sm me-1', btnDisabled)}
                                onClick={onSetDisabled}>Disabled
                        </button>
                    </FormColumn>
                    <FormColumn label="Title" width={8}>
                        <FieldInput value={title} field="title" onChange={changeHandler}
                                    placeholder="Title" required/>
                    </FormColumn>
                    <FormColumn width={8} label="Parent Category">
                        <CategorySelect value={parentId === null ? '' : parentId} required={true}
                                        disallow={disallowedChildIds} onChange={(ev) => changeHandler({
                            field: 'parentId',
                            value: Number(ev.target.value)
                        })}/>
                    </FormColumn>
                    {site.name === 'safety' && (
                        <FormColumn label="Handler File" width={8}>
                            <FieldInput value={title} field="handlerFile"
                                        onChange={changeHandler}
                                        placeholder="category.html.php" required/>
                            <small className="text-muted">Leave blank for default category handler</small>
                        </FormColumn>
                    )}
                    <FormColumn label="Lifestyle Image" width={8}>
                        <FieldInput field="lifestyle" value={lifestyle || ''} placeholder="Lifestyle Image"
                                    onChange={changeHandler}/>
                    </FormColumn>
                    <FormColumn label="Page CSS File" width={8}>
                        <FieldInput field="css" value={css || ''} placeholder="CSS Filename" onChange={changeHandler}/>
                    </FormColumn>
                    <FormColumn label="Text" width={8}>
                        <div className="input-group input-group-sm">
                            <FieldTextArea field="pageText" value={pageText || ''}
                                           onChange={changeHandler}/>
                            <button type="button" className="btn btn-outline-secondary"
                                    onClick={() => onClickEdit('pageText')}>
                                <span className="bi-code-slash"/>
                            </button>
                        </div>
                    </FormColumn>
                    <FormColumn label="SEO Description" width={8}>
                        <FieldTextArea field="descriptionMeta" value={descriptionMeta || ''}
                                       onChange={changeHandler}/>
                    </FormColumn>

                    <FormColumn width={8} label="SEO Changes / Priority">
                        <div className="row g-3">
                            <div className="col-6">
                                <SEOChangeFreqSelect value={changefreq || ''} field="changefreq"
                                                     onChange={changeHandler}
                                                     required={true}/>
                            </div>
                            <div className="col-6">
                                <SEOPrioritySelect value={priority || 0} field="priority" onChange={changeHandler}/>
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn width={8} label={' '}>
                        <button type="submit" className="btn btn-sm btn-primary me-1"
                                title={'last saved: ' + timestamp}>
                            Save
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                onClick={onNewCategory}>
                            New Catgegory
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger me-1"
                                onClick={onDeleteCategory}
                                disabled={true || !id || items.length > 0}>
                            Delete
                        </button>
                    </FormColumn>
                    {changed && <Alert message="Don't forget to save your changes"/>}
                </form>
                {loading && <Progress><ProgressBar striped/></Progress>}
            </div>
            {showEditor && <ModalEditor title={`Edit '${editorField}'`} content={category[editorField] || ''}
                                        onClose={onCloseEditor} onCancel={onCancelEditor}/>}
        </Fragment>
    )
}

export default CategoryEditor;
