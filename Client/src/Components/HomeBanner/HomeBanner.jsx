import React, { useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import './HomeBanner.scss';

import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { getCategories, getProducts } from '../../Api/products';

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

const FALLBACK_IMAGE =
  'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp';

const formatCategoryName = (name = '') =>
  name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const HomeBanner = () => {
  const navigate = useNavigate();
  const [categorySlides, setCategorySlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    pauseOnHover: true,
    adaptiveHeight: false,
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategorySlides = async () => {
      try {
        setLoading(true);

        const [categoryList, productResponse] = await Promise.all([
          getCategories(),
          getProducts({ limit: 300 }),
        ]);

        if (!isMounted) {
          return;
        }

        const productsByCategoryId = productResponse.items.reduce((map, product) => {
          const categoryId = Number(product.category_id);

          if (!map.has(categoryId)) {
            map.set(categoryId, []);
          }

          map.get(categoryId).push(product);
          return map;
        }, new Map());

        const imagePool = productResponse.items
          .map((product) => ({
            id: `fallback-${product.id}`,
            title: product.title,
            image: getProductImage(product),
          }))
          .filter((product) => product.image);

        const getSlideProducts = (categoryId) => {
          const categoryProducts = (productsByCategoryId.get(Number(categoryId)) || [])
            .map((product) => ({
              id: product.id,
              title: product.title,
              image: getProductImage(product),
            }))
            .filter((product) => product.image);

          const usedImages = new Set(categoryProducts.map((product) => product.image));
          const fallbackProducts = imagePool.filter(
            (product) => !usedImages.has(product.image),
          );

          return [...categoryProducts, ...fallbackProducts].slice(0, 3);
        };

        const slides = categoryList
          .filter((category) => Number(category.product_count || 0) > 0)
          .map((category) => ({
            id: category.id,
            name: category.name,
            title: `${formatCategoryName(category.name)} deals`,
            count: Number(category.product_count || 0),
            products: getSlideProducts(category.id),
          }));

        setCategorySlides(slides);
      } catch (error) {
        if (isMounted) {
          setCategorySlides([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategorySlides();

    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    if (categorySlides.length > 0) {
      return categorySlides;
    }

    return [
      {
        id: 'fallback',
        name: 'products',
        title: loading ? 'Loading latest deals' : 'Fresh deals for today',
        count: 0,
        products: [],
      },
    ];
  }, [categorySlides, loading]);

  const handleSlideClick = (categoryId) => {
    navigate(categoryId === 'fallback' ? '/products' : `/cat/${categoryId}`);
  };

  const handleShopClick = (event, categoryId) => {
    event.stopPropagation();
    handleSlideClick(categoryId);
  };

  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div
            key={`home-category-slide-${slide.id}`}
            className="homeCategorySlide"
            onClick={() => handleSlideClick(slide.id)}
          >
            <div className="slideCopy">
              <span className="slideEyebrow">Limited offers</span>
              <h1>{slide.title}</h1>
              <p>
                {slide.count > 0
                  ? `${slide.count} products with updated picks and clear prices.`
                  : 'Updated picks, clear prices, and products ready to ship.'}
              </p>
              <Button onClick={(event) => handleShopClick(event, slide.id)}>
                Shop now
                <IoIosArrowRoundForward />
              </Button>
            </div>

            <div className="slideProducts" aria-label={`${slide.title} products`}>
              {slide.products.length > 0 ? (
                slide.products.map((product, index) => (
                  <div
                    className={`slideProduct slideProduct${index + 1}`}
                    key={`home-slide-product-${product.id}`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="slideProduct slideProduct2">
                  <img src={FALLBACK_IMAGE} alt="Featured product" />
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;
