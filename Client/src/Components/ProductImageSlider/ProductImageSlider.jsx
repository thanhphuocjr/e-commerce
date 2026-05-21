import React, { useMemo, useState } from 'react';
import './ProductImageSlider.scss';

const ProductImageSlider = ({ images = [], discountPercentage = 0 }) => {
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .map((image) => (typeof image === 'string' ? image : image?.url))
      .filter(Boolean);
  }, [images]);

  const [selectedImage, setSelectedImage] = useState(0);

  if (normalizedImages.length === 0) {
    return (
      <div className="productSliderWrapper">
        <div className="mainImage noImage">No image available</div>
      </div>
    );
  }

  const safeIndex = Math.min(selectedImage, normalizedImages.length - 1);

  return (
    <div className="productSliderWrapper">
      <div className="mainImage">
        <div
          className="imageSlider"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {normalizedImages.map((img, idx) => (
            <img key={`${img}-${idx}`} src={img} alt={`product-${idx}`} draggable={false} />
          ))}
        </div>

        {Number(discountPercentage) > 0 && (
          <div className="discount">-{Math.round(discountPercentage)}%</div>
        )}
      </div>

      <div className="thumbnailList">
        {normalizedImages.map((img, idx) => (
          <div
            key={`thumb-${img}-${idx}`}
            className={`thumbItem ${safeIndex === idx ? 'active' : ''}`}
            onClick={() => setSelectedImage(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setSelectedImage(idx);
              }
            }}
          >
            <img src={img} alt={`thumb-${idx}`} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
