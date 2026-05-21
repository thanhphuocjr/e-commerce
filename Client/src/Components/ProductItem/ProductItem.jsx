import React, { useMemo, useState } from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import './ProductItem.scss';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { CiHeart } from 'react-icons/ci';
import ProductModal from '../ProductModal/ProductModal';
import { useNavigate } from 'react-router-dom';

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const ProductItem = ({ product, itemView = 'four' }) => {
  const navigate = useNavigate();
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = useMemo(() => {
    if (product?.thumbnail) {
      return product.thumbnail;
    }

    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage?.url;
    }

    return '';
  }, [product]);

  if (!product) {
    return null;
  }

  const rating = toNumber(product.avg_rating, toNumber(product.rating));
  const originalPrice = toNumber(product.price);
  const salePrice = toNumber(product.sale_price, originalPrice);
  const isOnSale = salePrice < originalPrice;
  const discount = Math.round(toNumber(product.discount_percentage));

  const isInStock =
    Number(product.stock || 0) > 0 && product.availability_status !== 'Out of Stock';

  return (
    <>
      <div className={`item productItem d-flex ${itemView}`}>
        <div
          className={`imgWrapper ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={product.title} className="w-100" />
          ) : (
            <div className="noImage">No image</div>
          )}

          {discount > 0 && <span className="badge bg-purple">-{discount}%</span>}

          <div className="actions">
            <Button className="one" onClick={() => setIsOpenProductModal(true)}>
              <BsArrowsFullscreen />
            </Button>
            <Button className="two">
              <CiHeart />
            </Button>
          </div>
        </div>

        <div
          className="info"
          onClick={() => {
            navigate(`/product/${product.id}`);
          }}
        >
          <h4>{product.title}</h4>

          <span className={`${isInStock ? 'text-success' : 'text-danger'} d-block`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <Rating name="read-only" value={rating} readOnly precision={0.5} />

          <div className="priceWrapper d-flex">
            {isOnSale && <div className="oldPrice">${originalPrice.toFixed(2)}</div>}
            <div className="newPrice text-danger ml-2">${salePrice.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <ProductModal
        open={isOpenProductModal}
        product={product}
        handleCloseProductModal={() => {
          setIsOpenProductModal(false);
          setIsHovered(false);
        }}
      />
    </>
  );
};

export default ProductItem;
