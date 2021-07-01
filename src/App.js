import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AlertList from "./ducks/alerts/AlertList";
import CategoryList from "./ducks/categories/CategoryList";
import CategoryEditor from "./components/CategoryEditor";
import CategoryItems from "./components/CategoryItems";
import Tabs from "./components/Tabs";
import {TAB_LIST, TABS} from "./constants";
import {setTab} from './actions';
import ItemEditor from "./components/ItemEditor";

class App extends Component {
    static propTypes = {
        tab: PropTypes.number,
        setTab: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tab: TABS.edit,
    };

    render() {
        const {tab, setTab} = this.props;
        return (
            <div>
                <AlertList/>
                <div className="row">
                    <div className="col-4">
                        <CategoryList/>
                    </div>
                    <div className="col-4">
                        <Tabs tabList={TAB_LIST} activeTab={tab} onSelect={setTab}/>
                        {tab === TABS.edit && <CategoryEditor/>}
                        {tab === TABS.items && <CategoryItems/>}
                    </div>
                    <div className="col-4">
                        <div className="sticky-50">
                            <ItemEditor/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({tab}) => {
    return {tab};
};

const mapDispatchToProps = {
    setTab
};

export default connect(mapStateToProps, mapDispatchToProps)(App) 
