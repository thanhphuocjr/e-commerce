import React, { useEffect, useMemo, useState } from 'react';
import './ProductDetail.scss';

import Rating from '@mui/material/Rating';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import ProductImageSlider from '../../Components/ProductImageSlider/ProductImageSlider';
import QuantityBox from '../../Components/QuantityBox/QuantityBox';
import Button from '@mui/material/Button';
import { FaCartPlus } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { MdCompareArrows } from 'react-icons/md';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import ProductItem from '../../Components/ProductItem/ProductItem';
import {
  getProductById,
  getProductReviews,
  getSimilarProducts,
  getTopRatedProducts,
} from '../../Api/products';
import { useParams } from 'react-router-dom';

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [reviewsData, setReviewsData] = useState({ items: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProductDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const productData = await getProductById(id);

        if (!productData) {
          throw new Error('Product not found');
        }

        const [similar, reviews, topRated] = await Promise.all([
          getSimilarProducts(id, 8),
          getProductReviews(id, { page: 1, limit: 6 }),
          getTopRatedProducts(10),
        ]);

        if (!isMounted) {
          return;
        }

        setProduct(productData);
        setSimilarProducts((similar || []).filter((item) => item.id !== productData.id));
        setRecommendedProducts((topRated || []).filter((item) => item.id !== productData.id));
        setReviewsData(reviews);
      } catch (loadError) {
        if (isMounted) {
          setError('Failed to load product details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <section className="productDetail section">
        <div className="container">
          <p className="text-light1">Loading product detail...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="productDetail section">
        <div className="container">
          <p className="text-danger">{error || 'Product not found.'}</p>
        </div>
      </section>
    );
  }

  const averageRating = toNumber(
    product.reviews?.average,
    toNumber(product.avg_rating, toNumber(product.rating)),
  );
  const reviewCount =
    Number(product.reviews?.count || reviewsData.summary?.total_reviews || product.review_count || 0);

  const originalPrice = toNumber(product.price);
  const salePrice = toNumber(product.sale_price, originalPrice);
  const isOnSale = salePrice < originalPrice;

  const isInStock =
    Number(product.stock || 0) > 0 && product.availability_status !== 'Out of Stock';

  return (
    <section className="productDetail section">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <ProductImageSlider
              images={images}
              discountPercentage={product.discount_percentage}
            />
          </div>

          <div className="col-md-8 info">
            <h2 className="hd text-capitalize">{product.title}</h2>

            <ul className="list list-inline d-flex align-items-center">
              <li className="list-inline-item">
                <div className="d-flex align-items-center">
                  <span className="text-light1 mr-2">Brand:</span>
                  <span className="brand">
                    {product.brand?.name || product.brand_name || 'N/A'}
                  </span>
                </div>
              </li>

              <li className="list-inline-item d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <Rating
                    name="read-only"
                    value={averageRating}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <span className="text-light1 ml-2">{reviewCount} Reviews</span>
                </div>
              </li>
            </ul>

            <div className="priceWrapper d-flex align-items-center">
              {isOnSale && <div className="oldPrice">${originalPrice.toFixed(2)}</div>}
              <div className="newPrice text-danger ml-2">${salePrice.toFixed(2)}</div>
            </div>

            <span className={`badge status mt-3 mb-4 ${isInStock ? 'bg-success' : 'bg-danger text-white'}`}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </span>

            <p className="desc mb-4">{product.description || 'No description available.'}</p>

            <div className="row set w-100 mb-5 align-items-center">
              <div className="choice d-flex col-3">
                <QuantityBox />
              </div>
              <Button className="purchase col-3 ml-5" disabled={!isInStock}>
                <FaCartPlus />
                <span className="ml-2">Add to cart</span>
              </Button>
              <div className="other d-flex align-items-center col-4 ml-2">
                <div className="d-flex">
                  <Button className="whish_list mr-4">
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

        <ProductTabs product={product} reviewsData={reviewsData} />

        {similarProducts.length > 0 && (
          <div className="relatedProducts">
            <h6 className="title">Related Products</h6>
            <div className="related_product mt-4">
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
                {similarProducts.map((item) => (
                  <SwiperSlide key={`similar-${item.id}`}>
                    <ProductItem product={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {recommendedProducts.length > 0 && (
          <div className="recentlyViewed">
            <h6 className="title">Recommended Products</h6>
            <div className="related_product mt-4">
              <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={5}
                navigation
                breakpoints={{
                  0: { slidesPerView: 1 },
                  576: { slidesPerView: 2 },
                  992: { slidesPerView: 4 },
                  1200: { slidesPerView: 5 },
                }}
              >
                {recommendedProducts.map((item) => (
                  <SwiperSlide key={`recommended-${item.id}`}>
                    <ProductItem product={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
