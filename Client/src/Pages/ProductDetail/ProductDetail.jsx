import React, { useState } from "react";
import "./ProductDetail.scss";

import Rating from "@mui/material/Rating";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import bestseller1 from "../../assets/images/BestSellers/1.jpg";
import bestseller2 from "../../assets/images/BestSellers/2.jpg";
import bestseller3 from "../../assets/images/BestSellers/3.jpg";

import ProductImageSlider from "../../Components/ProductImageSlider/ProductImageSlider";
import QuantityBox from "../../Components/QuantityBox/QuantityBox";
import Button from "@mui/material/Button"; // or replace with the correct path/library if using a different Button
import { FaCartPlus } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { MdCompareArrows } from "react-icons/md";
import Size from "../../Components/Size/Size"; // Update the path as needed
import ProductTabs from "../../Components/ProductTabs/ProductTabs";
import ProductItem from "../../Components/ProductItem/ProductItem"; // Adjust the path if needed

const ProductDetail = () => {
  return (
    <>
      <section className="productDetail section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ProductImageSlider
                images={[bestseller1, bestseller2, bestseller3]}
              />
            </div>

            <div className="col-md-8 info">
              <h2 className="hd text-capitalize">
                Natural VietNam-Style Clothes
              </h2>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text-light1 mr-2"> Brands:</span>
                    <span className="brand">Ntp's</span>
                  </div>
                </li>

                <li className="list-inline-item d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <Rating
                      name="read-only"
                      value={3.5}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <span className="text-light1 ml-2">3 Reviews</span>
                  </div>
                </li>
              </ul>
              <div className="priceWrapper d-flex align-items-center">
                <div className="oldPrice ">$39.24</div>
                <div className="newPrice text-danger ml-2">$29.01</div>
              </div>

              <span className="badge bg-success status mt-3 mb-4">
                In Stock
              </span>

              <p className="desc mb-4">
                Rs: Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book.ac
              </p>
              <Size />

              <div className="row set w-100 mb-5 align-items-center">
                <div className="choice d-flex col-3">
                  <QuantityBox />
                </div>
                <Button className="purchase col-3 ml-5">
                  <FaCartPlus />
                  <span className="ml-2">Add to cart </span>
                </Button>
                <div className="other d-flex align-items-center col-4 ml-2 ">
                  <div className="d-flex ">
                    <Button className="whish_list  mr-4">
                      <CiHeart />
                    </Button>
                    <Button className="compare">
                      <MdCompareArrows />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductTabs />

          <div className="relatedProducts">
            <h6 className="title">Related Products</h6>
            <div className="related_product mt-4">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={4}
                navigation
                // pagination={{ clickable: true }}
                // scrollbar={{ draggable: true }}
                // onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log("slide change")}
              >
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          <div className="recentlyViewed">
            <h6 className="title" >Recently Viewed Products</h6>
            <div className="related_product mt-4">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={6}
                navigation
                // pagination={{ clickable: true }}
                // scrollbar={{ draggable: true }}
                // onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log("slide change")}
              >
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductItem />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
