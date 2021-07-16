import React from 'react';
import {parseImageFilename} from "../../utils";
import {buildPath} from "../../fetch";
import {PATH_PRODUCT_IMAGE} from "../../constants";

interface CategoryImageProps {
    title: string,
    imageUrl?: string,
}

const CategoryImage: React.FC<CategoryImageProps> = ({title, imageUrl}) => {
    const src = buildPath(PATH_PRODUCT_IMAGE, {imageFile: imageUrl || 'missing.png'});
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl} title={title}/>
        </div>
    )
};

export default CategoryImage;
