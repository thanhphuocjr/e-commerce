import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import './ProductItem.scss';
//images
import bestseller1 from '../../assets/images/BestSellers/1.jpg';
import bestseller2 from '../../assets/images/BestSellers/2.jpg';
import bestseller3 from '../../assets/images/BestSellers/3.jpg';
import bestseller4 from '../../assets/images/BestSellers/4.jpg';
import bestseller5 from '../../assets/images/BestSellers/5.webp';

//icons
import { BsArrowsFullscreen } from 'react-icons/bs';
import { CiHeart } from 'react-icons/ci';
import ProductModal from '../ProductModal/ProductModal';

import { useNavigate } from 'react-router-dom';

const ProductItem = (props) => {
  const navigate = useNavigate();
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const handleOpenProductModal = () => {
    setIsOpenProductModal(true);
  };
  const handleCloseProductModal = () => {
    setIsOpenProductModal(false);
    setIsHovered(false);
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className={`item productItem d-flex ${props.itemView}`}>
        <div
          className={`imgWrapper ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img src={bestseller1} alt="" className="w-100" />
          <span className="badge bg-purple ">28%</span>
          <div className="actions">
            <Button className="one" onClick={handleOpenProductModal}>
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
            navigate('/product/1');
          }}
        >
          <h4>Men Alias-R </h4>
          <span className="text-success d-block">In Stock</span>
          <Rating name="read-only" value={4} readOnly />
          <div className="priceWrapper d-flex  ">
            <div className="oldPrice ">Rs 1200</div>
            <div className="newPrice text-danger ml-2">Rs 299</div>
          </div>
        </div>
      </div>

      {isOpenProductModal === true && (
        <ProductModal handleCloseProductModal={handleCloseProductModal} />
      )}
    </>
  );
};

export default ProductItem;
