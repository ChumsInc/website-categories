import React, {useState} from 'react';
import AlertList from "../ducks/alerts/AlertList";
import CategoryList from "../ducks/categories/CategoryList";
import CategoryEditor from "../ducks/categories/CategoryEditor";
import CategoryItemList from "../ducks/items/CategoryItemList";
import ItemEditor from "../ducks/items/ItemEditor";
import {ErrorBoundary} from "react-error-boundary";
import {Tab, TabList} from "chums-components";
import ErrorFallbackComponent from "../components/ErrorFallbackComponent";

const categoryTabs: Tab[] = [
    {id: 'edit', title: 'Edit Category', icon: 'bi-pencil-fill'},
    {id: 'items', title: 'Sort Items', icon: 'bi-filter-square-fill'},
];

const App: React.FC = () => {
    const [tab, setTab] = useState<string>(categoryTabs[0].id);
    return (
        <div>
            <AlertList/>
            <div className="row">
                <div className="col-4">
                    <CategoryList/>
                </div>
                <div className="col-4">
                    <TabList tabs={categoryTabs}
                             currentTabId={tab}
                             onSelectTab={(tab) => setTab(tab.id)} className="mb-1"/>
                    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                        {tab === 'edit' && <CategoryEditor/>}
                        {tab === 'items' && <CategoryItemList/>}
                    </ErrorBoundary>
                </div>
                <div className="col-4">
                    <div className="sticky-50">
                        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                            <ItemEditor/>
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
