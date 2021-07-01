import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {buildPath} from "../fetch";
import {NEW_CATEGORY, PREVIEW_URL, SITE_NAMES, SITES} from "../constants";
import {deleteCategory, saveCategory, selectCategory, updateCategory} from '../actions'
import FormGroup from "./FormGroup";
import TextInput from './TextInput';
import classNames from 'classnames';
import FormGroupTextInput from "./FormGroupTextInput";
import ModalEditor from "./ModalEditor";
import Alert from "../common-components/Alert";
import ProgressBar from "./ProgressBar";
import ControlledTextArea from "./ControlledTextArea";
import Select from "./Select";
import CategorySelect from "./CategorySelect";
import AlertExistingKeyword from "../ducks/keywords/AlertExistingKeyword";
import {calcChildIds, calcParentIds} from "../utils";

class CategoryEditor extends Component {
    static propTypes = {
        site: PropTypes.string,
        id: PropTypes.number,
        title: PropTypes.string,
        keyword: PropTypes.string,
        pageText: PropTypes.string,
        descriptionMeta: PropTypes.string,
        parentId: PropTypes.number,
        status: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        priority: PropTypes.number,
        handlerFile: PropTypes.string,
        lifestyle: PropTypes.string,
        css: PropTypes.string,
        timestamp: PropTypes.string,
        items: PropTypes.array,
        loadingCategory: PropTypes.bool,
        categories: PropTypes.array,
        disallowedChildIds: PropTypes.array,

        saveCategory: PropTypes.func,
        deleteCategory: PropTypes.func,
        updateCategory: PropTypes.func,
        selectCategory: PropTypes.func,
    };

    static defaultProps = {
        site: SITES.chums,
        id: 0,
        title: '',
        keyword: '',
        pageText: '',
        descriptionMeta: '',
        parentId: 0,
        status: 0,
        priority: 0.5,
        handlerFile: '',
        lifestyle: '',
        css: '',
        timestamp: null,
        items: [],
        loadingCategory: false,
        categories: [],
        disallowedChildIds: [],
    };

    state = {
        showEditor: false,
        editorField: '',
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSetEnabled = this.onSetEnabled.bind(this);
        this.onSetDisabled = this.onSetDisabled.bind(this);
        this.onCloseEditor = this.onCloseEditor.bind(this);
        this.onClickEditText = this.onClickEditText.bind(this);
        this.onChangeText2 = this.onChangeText2.bind(this);
        this.onNewCategory = this.onNewCategory.bind(this);
        this.onDeleteCategory = this.onDeleteCategory.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.saveCategory();
    }

    onChange({field, value}) {
        this.props.updateCategory({[field]: value});
    }

    onSetEnabled() {
        this.props.updateCategory({status: 1});
    }

    onSetDisabled() {
        this.props.updateCategory({status: 0});
    }

    onClickEditText() {
        this.setState({showEditor: true, editorField: 'pageText'});
    }

    onCloseEditor(ev) {
        console.log('onCloseEditor', ev)
        this.setState({showEditor: false, editorField: ''});
    }

    onChangeText2(ev) {
        this.props.updateCategory({pageText: ev.target.value});
    }

    onNewCategory() {
        this.props.selectCategory(NEW_CATEGORY);
    }

    onDeleteCategory() {
        this.props.deleteCategory();
    }

    render() {
        const {
            site, id, title, keyword, pageText, descriptionMeta, parentId, status, priority, timestamp,
            changefreq, handlerFile, css = '', lifestyle = '', changed, items = [], loadingCategory, categories,
            disallowedChildIds,
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

        // console.log('children', id, calcChildIds(categories, id));
        // console.log('parents', id, calcParentIds(categories, id));

        return (
            <Fragment>
                <div className="sticky-50">
                    <h4>Edit{' '}
                        {!!keyword && (
                        <small>
                            (<a href={buildPath(PREVIEW_URL, {domain: SITE_NAMES[site], keyword})}
                                   target="_blank">preview{!status ? ' in dev mode' : ''}</a>)
                        </small>)}
                    </h4>
                    <form onSubmit={this.onSubmit} className="my-3">
                        <FormGroup label="Keyword / ID" colWidth={8}>
                            <div className="form-row">
                                <div className="col-6">
                                    <TextInput value={keyword || ''} field="keyword" onChange={this.onChange} required/>
                                </div>
                                <div className="col-6">
                                    <TextInput value={id || 'new'} readOnly/>
                                </div>
                            </div>
                            <AlertExistingKeyword id={id} pageType={'category'} keyword={keyword}/>
                        </FormGroup>
                        <FormGroup colWidth={8} label="Status">
                            <button type="button" className={classNames('btn btn-sm', btnEnabled)}
                                    onClick={this.onSetEnabled}>Enabled
                            </button>
                            <button type="button" className={classNames('btn btn-sm', btnDisabled)}
                                    onClick={this.onSetDisabled}>Disabled
                            </button>
                        </FormGroup>
                        <FormGroupTextInput colWidth={8} label="Title" value={title} onChange={this.onChange}
                                            required={true}
                                            field="title"/>
                        <FormGroup colWidth={8} label="Parent Category">
                            <CategorySelect value={parentId === null ? '' : parentId} field={'parentId'} required={true}
                                            disallow={disallowedChildIds} onChange={this.onChange}/>
                        </FormGroup>
                        <FormGroupTextInput colWidth={8} label="Handler File"
                                            value={handlerFile} field="handlerFile"
                                            onChange={this.onChange} placeholder="category.html.php"
                                            id="category-handler" datalist={['cat-retainer-sorter.html.php']}
                                            helpText="Leave blank for default category handler"/>
                        <FormGroupTextInput colWidth={8} label="Lifestyle Image" value={lifestyle}
                                            onChange={this.onChange}
                                            field="lifestyle"/>
                        <FormGroupTextInput colWidth={8} label="Page CSS File" value={css} onChange={this.onChange}
                                            field="css"/>
                        <FormGroup colWidth={8} label="Text">
                            <div className="input-group input-group-sm">
                                <ControlledTextArea field="pageText" value={pageText || ''} maxRows={10}
                                                    onChange={this.onChange}/>
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-outline-secondary"
                                            onClick={this.onClickEditText}>
                                        <span className="material-icons">code</span>
                                    </button>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup colWidth={8} label="SEO Description">
                            <ControlledTextArea field="descriptionMeta" value={descriptionMeta || ''} maxRows={5}
                                                onChange={this.onChange}/>
                        </FormGroup>
                        <FormGroup colWidth={8} label="SEO Changes / Priority">
                            <div className="form-row">
                                <div className="col-6">
                                    <Select value={changefreq || ''} field="changefreq" onChange={this.onChange}
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
                                    <Select value={priority || 0} field="priority" onChange={this.onChange}>
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
                        </FormGroup>
                        <FormGroup colWidth={8} label={' '}>
                            <button type="submit" className="btn btn-sm btn-primary mr-1"
                                    title={'last saved: ' + timestamp}>
                                Save
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                    onClick={this.onNewCategory}>
                                New Catgegory
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger mr-1"
                                    onClick={this.onDeleteCategory}
                                    disabled={!id || items.length > 0}>
                                Delete
                            </button>
                        </FormGroup>
                        {changed && <Alert message="Don't forget to save your changes"/>}
                    </form>
                    {loadingCategory && <ProgressBar striped={true}/>}
                </div>
                {showEditor && <ModalEditor field={editorField} value={this.props[editorField]}
                                            onChange={this.onChange} onClose={this.onCloseEditor}/>}
            </Fragment>
        );
    }
}

const mapStateToProps = ({site, category, loadingCategory, categories}) => {
    const disallowedChildIds = calcChildIds(categories, category.id);
    return {
        site,
        ...category,
        loadingCategory,
        categories,
        disallowedChildIds,
    };
};

const mapDispatchToProps = {
    saveCategory,
    deleteCategory,
    updateCategory,
    selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEditor) 
