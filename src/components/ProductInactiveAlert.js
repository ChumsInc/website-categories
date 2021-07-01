import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Alert from "../common-components/Alert";

class ProductInactiveAlert extends Component {
    static propTypes = {
        keywords: PropTypes.arrayOf(PropTypes.shape({
            pagetype: PropTypes.string,
            keyword: PropTypes.string,
            title: PropTypes.string,
            redirect_to_parent: PropTypes.number,
            status: PropTypes.oneOf([0, 1]),
            id: PropTypes.number,
        })),

        id: PropTypes.number,
    };

    static defaultProps = {};

    render() {
        const {keywords, id} = this.props;
        const [keyword] = keywords
            .filter(keyword => keyword.pagetype === 'product')
            .filter(keyword => keyword.id === id)
            .filter(keyword => keyword.status === 0);
        return keyword
            ? <Alert type="warning" title="Warning:">'{keyword.title}' is inactive.</Alert>
            : null;
    }
}

const mapStateToProps = ({keywords}) => {
    return {keywords};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInactiveAlert) 
