import React, { useEffect, useState } from 'react';
import HomeBanner from '../../Components/HomeBanner/HomeBanner';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import { CiMail } from 'react-icons/ci';
import { IoIosArrowRoundForward } from 'react-icons/io';

import './Home.scss';
import newsLetterImg from '../../assets/images/Items/coupon.png';

import { Navigation, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ProductItem from '../../Components/ProductItem/ProductItem';
import { getNewArrivals, getTopRatedProducts } from '../../Api/products';

const getProductImage = (product) => {
  if (product?.thumbnail) {
    return product.thumbnail;
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage?.url;
  }

  return '';
};

const PromoCard = ({ product, eyebrow, title, layout = 'compact', onClick }) => {
  const imageUrl = getProductImage(product);

  return (
    <button
      type="button"
      className={`promoCard ${layout}`}
      onClick={() => onClick(product?.id)}
    >
      <div className="promoCopy">
        <span>{eyebrow}</span>
        <h4>{title}</h4>
        <p>{product?.title || 'Explore updated deals'}</p>
        <strong>Shop now</strong>
      </div>

      <div className="promoMedia">
        {imageUrl ? (
          <img src={imageUrl} alt={product.title} />
        ) : (
          <div className="promoMediaPlaceholder" />
        )}
      </div>
    </button>
  );
};

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

  const goToProduct = (productId) => {
    navigate(productId ? `/product/${productId}` : '/products');
  };

  const sidebarPromos = [
    {
      product: topRatedProducts[0],
      eyebrow: 'Top rated',
      title: 'Customer favorites',
    },
    {
      product: newArrivalProducts[0],
      eyebrow: 'New arrival',
      title: 'Fresh in stock',
    },
  ];

  const widePromos = [
    {
      product: topRatedProducts[1],
      eyebrow: 'Best value',
      title: 'Deals picked for you',
    },
    {
      product: newArrivalProducts[1],
      eyebrow: 'Just added',
      title: 'New products ready',
    },
  ];

  return (
    <>
      <HomeBanner />

      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="homeSidePromos mt-3">
                  {sidebarPromos.map((promo) => (
                    <PromoCard
                      key={`home-side-promo-${promo.eyebrow}`}
                      product={promo.product}
                      eyebrow={promo.eyebrow}
                      title={promo.title}
                      onClick={goToProduct}
                    />
                  ))}
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
                {widePromos.map((promo) => (
                  <PromoCard
                    key={`home-wide-promo-${promo.eyebrow}`}
                    product={promo.product}
                    eyebrow={promo.eyebrow}
                    title={promo.title}
                    layout="wide"
                    onClick={goToProduct}
                  />
                ))}
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
