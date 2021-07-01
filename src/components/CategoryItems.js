import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import ProgressBar from "./ProgressBar";
import CategoryItemList from "./CategoryItemList";

class CategoryItems extends Component {
    static propTypes = {
        loadingCategory: PropTypes.bool,
    };

    static defaultProps = {
        loadingCategory: false,
    };

    componentDidCatch(error, info) {
        console.log(error, info);
    }


    render() {
        const {loadingCategory} = this.props;

        return (
            <div className="sticky-50">
                {loadingCategory && <ProgressBar striped={true}/>}
                {!loadingCategory && (
                    <DndProvider backend={HTML5Backend}>
                        <CategoryItemList/>
                    </DndProvider>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({loadingCategory}) => {
    return {loadingCategory};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItems) 

