import React from 'react';
import {previewURL} from "./utils";
import {useSelector} from "react-redux";
import {selectCurrentCategory} from "./selectors";

const PreviewLink = () => {
    const category = useSelector(selectCurrentCategory);
    if (!category || category.id === 0) {
        return null;
    }
    return (
        <a href={previewURL(category.keyword)} target="_blank">
            Preview {category.keyword}
            <span className="bi-share-fill ms-1" />
        </a>
    )
}

export default PreviewLink;
