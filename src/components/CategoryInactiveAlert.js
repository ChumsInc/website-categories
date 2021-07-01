import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Alert from "../common-components/Alert";

class CategoryInactiveAlert extends Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            status: PropTypes.number,
            title: PropTypes.string,
        })),
        id: PropTypes.number,
    };

    static defaultProps = {};

    render() {
        const {categories, id} = this.props;
        const [category] = categories
            .filter(cat => cat.id === id)
            .filter(cat => cat.status === 0);
        return (
            <div>
                {category && <Alert type="warning" title="Warning:">'{category.title}' is inactive.</Alert>}
            </div>
        );
    }
}

const mapStateToProps = ({categories}) => {
    return {categories};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryInactiveAlert)
