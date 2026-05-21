import React, { useEffect, useState } from 'react';
import HomeBanner from '../../Components/HomeBanner/HomeBanner';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import { CiMail } from 'react-icons/ci';
import { IoIosArrowRoundForward } from 'react-icons/io';

import './Home.scss';
import banner1 from '../../assets/images/BannerColumn/banner1.jpg';
import banner2 from '../../assets/images/BannerColumn/banner2.jpg';
import banner3 from '../../assets/images/BannerColumn/banner3.jpg';
import banner4 from '../../assets/images/BannerColumn/banner4.jpg';
import newsLetterImg from '../../assets/images/Items/coupon.png';

import { Navigation, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ProductItem from '../../Components/ProductItem/ProductItem';
import { getNewArrivals, getTopRatedProducts } from '../../Api/products';

const Home = () => {
  const navigate = useNavigate();
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHomeProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const [topRated, newArrivals] = await Promise.all([
          getTopRatedProducts(12),
          getNewArrivals(12),
        ]);

        setTopRatedProducts(topRated);
        setNewArrivalProducts(newArrivals);
      } catch (loadError) {
        setError('Failed to load product list. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadHomeProducts();
  }, []);

  const goToProducts = () => {
    navigate('/products');
  };

  return (
    <>
      <HomeBanner />

      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner mt-3">
                  <img src={banner1} alt="promo banner 1" />
                </div>
                <div className="banner mt-3">
                  <img src={banner2} alt="promo banner 2" />
                </div>
              </div>
            </div>

            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center mt-5 mb-3">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BEST SELLER</h3>
                  <p className="text-light1 text-sml mb-0">
                    Top-rated products from our latest inventory.
                  </p>
                </div>
                <Button className="viewAllBtn" onClick={goToProducts}>
                  View All
                  <IoIosArrowRoundForward />
                </Button>
              </div>

              {loading && <p className="text-light1">Loading products...</p>}
              {error && <p className="text-danger">{error}</p>}

              {!loading && !error && (
                <div className="bestSeller mt-4">
                  <Swiper
                    modules={[Navigation, Scrollbar, A11y]}
                    spaceBetween={10}
                    slidesPerView={4}
                    navigation
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      576: { slidesPerView: 2 },
                      992: { slidesPerView: 3 },
                      1200: { slidesPerView: 4 },
                    }}
                  >
                    {topRatedProducts.map((product) => (
                      <SwiperSlide key={`top-rated-${product.id}`}>
                        <ProductItem product={product} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              <div className="d-flex align-items-center mt-5 mb-3">
                <div className="info w-75">
                  <h3 className="mb-0 hd">new products</h3>
                  <p className="text-light1 text-sml mb-0">
                    New products with updated stocks.
                  </p>
                </div>
                <Button className="viewAllBtn" onClick={goToProducts}>
                  View All
                  <IoIosArrowRoundForward />
                </Button>
              </div>

              {!loading && !error && (
                <div className="productRow productRow2 w-100 mt-4 d-flex">
                  {newArrivalProducts.slice(0, 8).map((product) => (
                    <ProductItem key={`new-arrival-${product.id}`} product={product} />
                  ))}
                </div>
              )}

              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner">
                  <img src={banner3} alt="promo banner 3" className="cursor w-100" />
                </div>
                <div className="banner">
                  <img src={banner4} alt="promo banner 4" className="cursor w-100" />
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
              <h4 className="header text-white">Join our newsletter and get...</h4>
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
              <img src={newsLetterImg} alt="newsletter" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
