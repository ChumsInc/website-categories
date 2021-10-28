import React from 'react';
import {useSelector} from 'react-redux';
import {AlertList} from "chums-ducks/dist/ducks";
import CategoryList from "../ducks/categories/CategoryList";
import CategoryEditor from "../ducks/categories/CategoryEditor";
import AppTabs, {categoryTabID, categoryTabKey} from "./AppTabs";
import {selectCurrentTab} from "chums-ducks";
import CategoryItemList from "../ducks/items/CategoryItemList";
import ItemEditor from "../ducks/items/ItemEditor";
import {ErrorBoundary} from "chums-ducks/dist/components";

const App: React.FC = () => {
    const tab = useSelector(selectCurrentTab(categoryTabKey));
    return (
        <div>
            <AlertList/>
            <div className="row">
                <div className="col-4">
                    <CategoryList/>
                </div>
                <div className="col-4">
                    <AppTabs/>
                    <ErrorBoundary>
                        {tab === categoryTabID.edit && <CategoryEditor/>}
                        {tab === categoryTabID.items && <CategoryItemList/>}
                    </ErrorBoundary>
                </div>
                <div className="col-4">
                    <div className="sticky-50">
                        <ErrorBoundary>
                            <ItemEditor/>
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
