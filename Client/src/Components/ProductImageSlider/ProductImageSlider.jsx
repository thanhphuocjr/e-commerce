import React, { useState } from "react";
import "./ProductImageSlider.scss";

const ProductImageSlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="productSliderWrapper">
      {/* ẢNH LỚN - Slide mượt mà */}
      <div className="mainImage">
        <div
          className="imageSlider"
          style={{
            transform: `translateX(-${selectedImage * 100}%)`,
          }}
        >
          {images.map((img, idx) => (
            <img key={idx} src={img} alt={`slide-${idx}`} draggable={false} />
          ))}
        </div>
        <div className="discount">10%</div>
      </div>

      {/* DANH SÁCH ẢNH THUMBNAIL */}
      <div className="thumbnailList">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`thumbItem ${selectedImage === idx ? "active" : ""}`}
            onClick={() => setSelectedImage(idx)}
          >
            <img src={img} alt={`thumb-${idx}`} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
