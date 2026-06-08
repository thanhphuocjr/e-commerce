import React, { useEffect, useMemo, useState } from 'react';
import './ProductModal.scss';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { MdClose, MdCompareArrows } from 'react-icons/md';
import ProductImageSlider from '../ProductImageSlider/ProductImageSlider';
import { FaCartPlus } from 'react-icons/fa6';
import { CiHeart } from 'react-icons/ci';
import QuantityBox from '../QuantityBox/QuantityBox';
import { addToCart } from '../../Api/cart';
import { getToken } from '../../Api/auth';
import { useNavigate } from 'react-router-dom';

const getPrice = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const ProductModal = ({ open, product, handleCloseProductModal }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    setQuantity(1);
    setCartMessage('');
  }, [product?.id, open]);

  const images = useMemo(() => {
    const imageList = Array.isArray(product?.images)
      ? product.images
          .map((image) => (typeof image === 'string' ? image : image?.url))
          .filter(Boolean)
      : [];

    if (imageList.length > 0) {
      return imageList;
    }

    return product?.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  if (!product) {
    return null;
  }

  const originalPrice = getPrice(product.price);
  const salePrice = getPrice(product.sale_price, originalPrice);
  const isOnSale = salePrice < originalPrice;
  const rating = getPrice(product.avg_rating, getPrice(product.rating));
  const isInStock =
    Number(product.stock || 0) > 0 && product.availability_status !== 'Out of Stock';
  const maxQuantity = Math.max(1, Number(product.stock || 1));

  const handleAddToCart = () => {
    if (!getToken()) {
      handleCloseProductModal();
      navigate('/signIn');
      return;
    }

    addToCart(product, quantity);
    setCartMessage(`${quantity} item(s) added to cart.`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseProductModal}
      classes={{ paper: 'customDialogPaper' }}
    >
      <Button className="close_" onClick={handleCloseProductModal}>
        <MdClose />
      </Button>

      <h4 className="mb-0 font-weight-bold mb-2">{product.title}</h4>

      <div className="d-flex align-items-center">
        <span className="ml-0">Brand:</span>
        <span className="ml-2 font-weight-bold mr-4">
          {product.brand?.name || product.brand_name || 'N/A'}
        </span>
        <Rating
          name="read-only"
          value={rating}
          readOnly
          size="small"
          precision={0.5}
        />
      </div>

      <hr />

      <div className="row mt-2 productDetailModal">
        <div className="col-md-5">
          <ProductImageSlider
            images={images}
            discountPercentage={product.discount_percentage}
          />
        </div>

        <div className="col-md-7">
          <div className="price d-flex mt-2 align-items-center">
            {isOnSale && <div className="oldPrice mr-3">${originalPrice.toFixed(2)}</div>}
            <div className="newPrice text-danger mt-0">${salePrice.toFixed(2)}</div>
          </div>

          <span className={`status badge mt-3 mb-4 ${isInStock ? 'bg-success' : 'bg-danger text-white'}`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <span className="desc mb-4">{product.description || 'No description available.'}</span>

          <div className="row set w-100 mb-3">
            <div className="choice d-flex col-4">
              <QuantityBox
                value={quantity}
                onChange={setQuantity}
                max={maxQuantity}
                disabled={!isInStock}
              />
            </div>
            <Button
              className="purchase col-4 ml-5"
              disabled={!isInStock}
              onClick={handleAddToCart}
            >
              <FaCartPlus />
              <span className="ml-2">Add to cart</span>
            </Button>
          </div>

          {cartMessage && <span className="cartMessage">{cartMessage}</span>}

          <div className="others row w-100 mt-4">
            <Button className="whish_list inline-block mr-4 d-flex align-items-center">
              <CiHeart />
              <span className="ml-2">Add to wishlist</span>
            </Button>
            <Button className="compare d-flex align-items-center">
              <MdCompareArrows />
              <span className="ml-2">Compare</span>
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;
