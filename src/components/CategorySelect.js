import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Select from "./Select";
import {getParentIds} from "../utils";
import classNames from 'classnames';

const keywordSort = (a, b) => a.keyword === b.keyword ? 0 : (a.keyword > b.keyword ? 1 : -1);

class CategorySelect extends Component {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            keyword: PropTypes.string,
            parentId: PropTypes.number,
            status: PropTypes.oneOf([0, 1]),
        })),
        disallow: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]
        ),

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        value: '',
        categories: [],
        disallow: []
    };

    render() {
        const {field, value, categories, onChange, disallow, ...props} = this.props;
        // const disabledIds = getParentIds(categories, value).filter(id => id !== value);
        // console.log('parents' , value, getParentIds(categories, value));
        return (
            <Select field={field} value={value}
                    onChange={({field, value}) => onChange({field, value: Number(value)})} {...props}>
                <option value="">Select One</option>
                <option value={0}>-- none --</option>
                {categories
                    .sort(keywordSort)
                    .map(cat => (
                        <option value={cat.id} key={cat.id} className={classNames({inactive: cat.status === 0})}
                                disabled={(Array.isArray(disallow) ? disallow : [disallow]).includes(cat.id)}>
                            {cat.keyword}
                        </option>
                    ))
                }
            </Select>
        );
    }
}

const mapStateToProps = ({categories}) => {
    return {categories};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelect) 
