import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Select from "./Select";
import classNames from 'classnames';

const keywordSort = (a, b) => a.keyword === b.keyword ? 0 : (a.keyword > b.keyword ? 1 : -1);

class ProductSelect extends Component {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        keywords: PropTypes.arrayOf(PropTypes.shape({
            pagetype: PropTypes.string,
            keyword: PropTypes.string,
            redirect_to_parent: PropTypes.number,
            status: PropTypes.oneOf([0, 1]),
            id: PropTypes.number,
        })),

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        value: '',
        keywords: [],
    };

    render() {
        const {field, value, onChange, keywords, ...props} = this.props;
        return (
            <Select field={field} value={value}
                    onChange={({field, value}) => onChange({field, value: Number(value)})} {...props}>
                <option value="">Select One</option>
                <option value={0}>-- none --</option>
                {keywords
                    .filter(kw => kw.pagetype === 'product')
                    .filter(p => p.redirect_to_parent !== 1 || p.id === value)
                    .sort(keywordSort)
                    .map(p => (
                        <option value={p.id} key={p.id} className={classNames({inactive: p.status === 0})}>
                            {p.keyword}
                        </option>
                    ))}
            </Select>
        );
    }
}

const mapStateToProps = ({keywords}) => {
    return {keywords};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelect)
