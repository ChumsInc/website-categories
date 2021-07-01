import React from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CategoryItemList from "./CategoryItemList";

const CategoryDragDropContext = ({}) => {
    return (
        <DragDropContextProvider backend={HTML5Backend}>
            <CategoryItemList/>
        </DragDropContextProvider>
    )
}

export default CategoryDragDropContext;
