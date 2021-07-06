import React, {Component, FormEvent, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch, useSelector} from 'react-redux';
import {buildPath} from "../../fetch";
import {NEW_CATEGORY, PREVIEW_URL, SITE_NAMES, SITES} from "../../constants";
import {deleteCategory, saveCategory, selectCategory, updateCategory} from '../../actions'
import FormGroup from "../../components/FormGroup";
import TextInput from '../../components/TextInput';
import classNames from 'classnames';
import ModalEditor from "../../components/ModalEditor";
import Alert from "../../common-components/Alert";
import ProgressBar from "../../components/ProgressBar";
import ControlledTextArea from "../../components/ControlledTextArea";
import Select from "../../components/Select";
import CategorySelect from "./CategorySelect";
import AlertExistingKeyword from "../keywords/AlertExistingKeyword";
import {calcChildIds, calcParentIds} from "../../utils";
import FormColumn from "../../common-components/FormColumn";

import FieldInput from "../../common-components/FieldInput";
import {childCategoriesSelector, loadingSelector, selectedCategorySelector} from "./index";
import {currentSiteSelector} from "../sites";
import {Category, defaultCategory, InputField} from "../types";
import {changeCategoryAction, selectCategoryAction} from "./actions";

interface CategoryEditorProps {

}

const CategoryEditor:React.FC<CategoryEditorProps> = ({}) => {
    const dispatch = useDispatch();
    const category = useSelector(selectedCategorySelector);
    const {id, keyword, status, css, priority, lifestyle, title, changefreq, descriptionMeta, pageText, parentId, timestamp, children: items, changed} = category;
    const site = useSelector(currentSiteSelector);
    const disallowedChildIds = useSelector(childCategoriesSelector);
    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState('pageText');
    const loading = useSelector(loadingSelector)

    const onSubmit = (ev:FormEvent) => {
        ev.preventDefault();

    }

    const changeHandler = ({field, value}:InputField) => {
        dispatch(changeCategoryAction({...category, [field]: value}));
    }

    const onSetEnabled = () => changeHandler({field: 'status', value: true});
    const onSetDisabled = () => changeHandler({field: 'status', value: false});

    const onClickEdit = (field:keyof Category) => {
        setEditorField(category[field] || '');
        setShowEditor(true);
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
                            (<a href={buildPath(PREVIEW_URL, {domain: site.domain, keyword})}
                                target="_blank">preview{!status ? ' in dev mode' : ''}</a>)
                        </small>)}
                </h4>
                <form onSubmit={onSubmit} className="my-3">
                    <FormColumn label="ID / Keyword" width={8}>
                        <div className="input-group input-group-sm">
                            <div className="input-group-text">{id || 'new'}</div>
                            <FieldInput value={keyword || ''} field="keyword" onChange={changeHandler} required/>
                        </div>
                        <AlertExistingKeyword keyword={keyword}/>
                    </FormColumn>
                    <FormColumn width={8} label="Status">
                        <button type="button" className={classNames('btn btn-sm', btnEnabled)}
                                onClick={onSetEnabled}>Enabled
                        </button>
                        <button type="button" className={classNames('btn btn-sm', btnDisabled)}
                                onClick={onSetDisabled}>Disabled
                        </button>
                    </FormColumn>
                    <FormColumn label="Title" width={8}>
                        <FieldInput value={title} field="title" onChange={changeHandler}
                                    placeholder="Title" required/>
                    </FormColumn>
                    <FormColumn width={8} label="Parent Category">
                        <CategorySelect value={parentId === null ? '' : parentId} required={true}
                                        disallow={disallowedChildIds} onChange={(ev) => changeHandler({field: 'parentId', value: Number(ev.target.value)})}/>
                    </FormColumn>
                    <FormColumn label="Handler File" width={8}>
                        <FieldInput value={title} field="handlerFile"
                                    onChange={changeHandler}
                                    placeholder="category.html.php" required disabled={site.name === 'b2b'}/>
                        <small className="text-muted">Leave blank for default category handler</small>
                    </FormColumn>
                    <FormColumn label="Lifestyle Image" width={8}>
                        <FieldInput field="lifestyle" value={lifestyle || ''} placeholder="Lifestyle Image" onChange={changeHandler} />
                    </FormColumn>
                    <FormColumn label="Page CSS File" width={8}>
                        <FieldInput field="css" value={css || ''} placeholder="CSS Filename" onChange={changeHandler} />
                    </FormColumn>
                    <FormColumn label="Text" width={8}>
                        <div className="input-group input-group-sm">
                            <ControlledTextArea field="pageText" value={pageText || ''} maxRows={10}
                                                onChange={changeHandler}/>
                            <button type="button" className="btn btn-outline-secondary"
                                    onClick={() => onClickEdit('pageText')}>
                                <span className="bi-code-slash" />
                            </button>
                        </div>
                    </FormColumn>
                    <FormColumn label="SEO Description" width={8}>
                        <ControlledTextArea field="descriptionMeta" value={descriptionMeta || ''} maxRows={5}
                                            onChange={changeHandler}/>
                    </FormColumn>

                    <FormColumn width={8} label="SEO Changes / Priority">
                        <div className="row g-3">
                            <div className="col-6">
                                <Select value={changefreq || ''} field="changefreq" onChange={changeHandler}
                                        required={true}>
                                    <option>Select One</option>
                                    <option value="n/a">Not Published</option>
                                    <option value="always">always</option>
                                    <option value="hourly">hourly</option>
                                    <option value="daily">daily</option>
                                    <option value="weekly">weekly</option>
                                    <option value="monthly">monthly</option>
                                    <option value="yearly">yearly</option>
                                    <option value="never">never</option>
                                </Select>
                            </div>
                            <div className="col-6">
                                <Select value={priority || 0} field="priority" onChange={changeHandler}>
                                    <option>Select One</option>
                                    <option value={0.0}>0.0</option>
                                    <option value={0.1}>0.1</option>
                                    <option value={0.2}>0.2</option>
                                    <option value={0.3}>0.3</option>
                                    <option value={0.4}>0.4</option>
                                    <option value={0.5}>0.5</option>
                                    <option value={0.6}>0.6</option>
                                    <option value={0.7}>0.7</option>
                                    <option value={0.8}>0.8</option>
                                    <option value={0.9}>0.9</option>
                                    <option value={1.0}>1.0</option>
                                </Select>
                            </div>
                        </div>
                    </FormColumn>
                    <FormGroup colWidth={8} label={' '}>
                        <button type="submit" className="btn btn-sm btn-primary mr-1"
                                title={'last saved: ' + timestamp}>
                            Save
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                onClick={onNewCategory}>
                            New Catgegory
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger mr-1"
                                onClick={onDeleteCategory}
                                disabled={true || !id || items.length > 0}>
                            Delete
                        </button>
                    </FormGroup>
                    {changed && <Alert message="Don't forget to save your changes"/>}
                </form>
                {loading && <ProgressBar striped={true}/>}
            </div>
            {showEditor && <ModalEditor field={editorField} value={editorField}
                                        onChange={changeHandler} onClose={() => setShowEditor(false)}/>}
        </Fragment>
    )
}

export default CategoryEditor;
