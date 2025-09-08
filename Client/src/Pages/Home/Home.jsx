import React from "react";
import HomeBanner from "../../Components/HomeBanner/HomeBanner";
import Button from "@mui/material/Button";

import { CiMail } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";

import "./Home.scss";
import banner1 from "../../assets/images/BannerColumn/banner1.jpg";
import banner2 from "../../assets/images/BannerColumn/banner2.jpg";
import banner3 from "../../assets/images/BannerColumn/banner3.jpg";
import banner4 from "../../assets/images/BannerColumn/banner4.jpg";
import newsLetterImg from "../../assets/images/Items/coupon.png";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import bestseller1 from "../../assets/images/BestSellers/1.jpg";
import bestseller2 from "../../assets/images/BestSellers/2.jpg";
import bestseller3 from "../../assets/images/BestSellers/3.jpg";
import bestseller4 from "../../assets/images/BestSellers/4.jpg";
import bestseller5 from "../../assets/images/BestSellers/5.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductItem from "../../Components/ProductItem/ProductItem";


const Home = () => {
  return (
    <>
      <HomeBanner />
      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner mt-3">
                  <img src={banner1} alt="" />
                </div>
                <div className="banner mt-3">
                  <img src={banner2} alt="" />
                </div>
              </div>
            </div>
            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center mt-5 mb-3 ">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BEST SELLER</h3>
                  <p className="text-light1 text-sml mb-0">
                    Do not miss the current offers until the end of July
                  </p>
                </div>
                <Button className="viewAllBtn">
                  View All
                  <IoIosArrowRoundForward />
                </Button>
              </div>

              {/* bestSeller */}
              <div className="bestSeller mt-4">
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
                </Swiper>
              </div>

              {/* New Products */}
              <div className="d-flex align-items-center mt-5 mb-3 ">
                <div className="info w-75">
                  <h3 className="mb-0 hd">new products</h3>
                  <p className="text-light1 text-sml mb-0">
                    New products with updated stocks.
                  </p>
                </div>
                <Button className="viewAllBtn">
                  View All
                  <IoIosArrowRoundForward />
                </Button>
              </div>
              <div className="productRow productRow2 w-100 mt-4 d-flex">
                <ProductItem /> <ProductItem /> <ProductItem /> <ProductItem />
                <ProductItem /> <ProductItem /> <ProductItem /> <ProductItem />
              </div>

              {/* Banner */}
              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner ">
                  <img src={banner3} alt="" className="cursor w-100" />
                </div>
                <div className="banner ">
                  <img src={banner4} alt="" className="cursor w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-white">$20 discount for your first order</p>
              <h4 className="header text-white">
                Join our newsletter and get...
              </h4>
              <p className="desc text-light">
                Join our email subscription <br />
                now to get updates on promotions and coupons.
              </p>

              <form>
                <CiMail />
                <input placeholder="Your email address" type="email" />
                <Button>Subscribe</Button>
              </form>
            </div>

            <div className="col-md-6">
              <img src={newsLetterImg} alt="" />
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Home;
