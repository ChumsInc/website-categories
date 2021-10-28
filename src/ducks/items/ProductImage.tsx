import React from 'react';
import {parseImageFilename} from "../../utils";
import {buildPath} from "chums-ducks";

interface ProductImageProps {
    title?: string,
    image?: string,
    defaultColor?: string,
    imageUrl?: string,
}

const ProductImage: React.FC<ProductImageProps> = ({
                                                       image,
                                                       defaultColor,
                                                       imageUrl
                                                   }) => {
    const imageFile = parseImageFilename({
        image: imageUrl || image || 'missing.png',
        colorCode: defaultColor || ''
    });
    const src = buildPath('https\\://intranet.chums.com/images/products/400/:imageFile', {imageFile});
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl || image} title={imageFile}/>
        </div>
    )
};

export default ProductImage;
