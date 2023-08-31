import React from 'react';

interface CategoryImageProps {
    title: string,
    imageUrl?: string,
}

const CategoryImage = ({title, imageUrl}:CategoryImageProps) => {
    const src = `https://intranet.chums.com/images/products/400/${encodeURIComponent(imageUrl || 'missing.png')}`;
    return (
        <div>
            <img className="img-thumbnail" src={src} alt={imageUrl} title={title}/>
        </div>
    )
};

export default CategoryImage;
