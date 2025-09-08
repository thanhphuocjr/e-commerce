import React, { useState } from 'react';
import './ProductModal.scss';
import Dialog from '@mui/material/Dialog'; // or the correct path/library for Dialog
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { MdClose } from 'react-icons/md';

import bestseller1 from '../../assets/images/BestSellers/1.jpg';
import bestseller2 from '../../assets/images/BestSellers/2.jpg';
import bestseller3 from '../../assets/images/BestSellers/3.jpg';
import bestseller4 from '../../assets/images/BestSellers/4.jpg';
import bestseller5 from '../../assets/images/BestSellers/5.webp';
import ProductImageSlider from '../ProductImageSlider/ProductImageSlider';

import { FaCartPlus } from 'react-icons/fa6';
import { CiHeart } from 'react-icons/ci';
import { MdCompareArrows } from 'react-icons/md';
import QuantityBox from '../QuantityBox/QuantityBox';
import Size from '../Size/Size';

const ProductModal = (props) => {
  const sizes = ['Xs', 'S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <>
      <Dialog
        open={true}
        onClose={() => props.handleCloseProductModal()}
        classes={{ paper: 'customDialogPaper' }}
      >
        <Button
          className="close_"
          onClick={() => props.handleCloseProductModal()}
        >
          <MdClose />
        </Button>

        <h4 className="mb-0 font-weight-bold mb-2">
          Men Alias-N Regular Fit Spread Collar Shirt
        </h4>

        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <span className="ml-0">Brands:</span>
            <span className="ml-2 font-weight-bold mr-4">Rare Rabbit</span>
            <Rating
              name="read-only"
              value={3}
              readOnly
              size="small"
              precision={0.5}
            />
          </div>
        </div>
        <hr />
        <div className="row mt-2 productDetailModal">
          <div className="col-md-5">
            <ProductImageSlider
              images={[bestseller1, bestseller2, bestseller3]}
            />
          </div>
          <div className="col-md-7">
            <div className="price d-flex mt-2 align-items-center">
              <div className="oldPrice mr-3">RS:1200</div>
              <div className="newPrice text-danger mt-0">RS:299</div>
            </div>
            <span className="status badge bg-success  mt-3 mb-4">In Stock</span>
            <span className="desc mb-4">
              Rs: Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book.ac
            </span>
            <Size />
            <div className="row set w-100 mb-3">
              <div className="choice d-flex col-4">
                <QuantityBox />
              </div>
              <Button className="purchase col-4 ml-5">
                <FaCartPlus />
                <span className="ml-2">Add to cart </span>
              </Button>
            </div>

            <div className="others row w-100 mt-4 ">
              <Button className="whish_list inline-block mr-4 d-flex align-items-center ">
                <CiHeart />
                <span className="ml-2 ">Add to whishlist</span>
              </Button>
              <Button className="compare">
                <MdCompareArrows />
                <span className="ml-2">Compare</span>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProductModal;
