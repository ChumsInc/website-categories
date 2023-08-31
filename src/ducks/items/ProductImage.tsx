import React from 'react';
import {parseImageFilename} from "../../utils";

interface ProductImageProps {
    title?: string,
    image?: string,
    defaultColor?: string,
    imageUrl?: string,
}

const ProductImage = ({
                          image,
                          defaultColor,
                          imageUrl
                      }: ProductImageProps) => {
    const imageFile = parseImageFilename({
        image: imageUrl || image || 'missing.png',
        colorCode: defaultColor || ''
    });
    const src = `https://intranet.chums.com/images/products/400/${encodeURIComponent(imageFile)}`;
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl || image} title={imageFile}/>
        </div>
    )
};

export default ProductImage;
