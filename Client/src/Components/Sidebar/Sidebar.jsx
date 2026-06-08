import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import './Sidebar.scss';

import { Link } from 'react-router-dom';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import Rating from '@mui/material/Rating';

const RATING_OPTIONS = [5, 4, 3, 2, 1];
const formatCategoryName = (name = '') =>
  name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

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

const Sidebar = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  promoProducts = [],
  priceRange = [0, 1000],
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  minRating,
  onMinRatingChange,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  useEffect(() => {
    if (
      localPriceRange[0] === priceRange[0] &&
      localPriceRange[1] === priceRange[1]
    ) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      onPriceRangeChange(localPriceRange);
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [localPriceRange, onPriceRangeChange, priceRange]);

  return (
    <div className="sidebar">
      <div className="sticky">
        <div className="filterBox">
          <h6>Product Categories</h6>

          <div className="scroll">
            <ul className="categoryList">
              <li>
                <button
                  type="button"
                  className={`categoryBtn ${!selectedCategoryId ? 'active' : ''}`}
                  onClick={() => onSelectCategory(null)}
                >
                  All Products
                </button>
              </li>

              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className={`categoryBtn ${
                      Number(selectedCategoryId) === Number(category.id)
                        ? 'active'
                        : ''
                    }`}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    <span>{formatCategoryName(category.name)}</span>
                    <small>{category.product_count || 0}</small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="filterBox">
          <h6 className="mb-3">Filter By Price</h6>

          <RangeSlider
            value={localPriceRange}
            onInput={setLocalPriceRange}
            min={0}
            max={5000}
            step={10}
          />

          <div className="d-flex pt-2 pb-2 priceRange normal_text">
            <span>
              From: <strong className="text-dark">${localPriceRange[0]}</strong>
            </span>
            <span className="ml-auto">
              To: <strong className="text-dark">${localPriceRange[1]}</strong>
            </span>
          </div>
        </div>

        <div className="filterBox">
          <h6>Product Status</h6>

          <FormControlLabel
            className="w-100"
            control={<Checkbox checked={inStockOnly} />}
            label="In Stock"
            onChange={(event) => onInStockOnlyChange(event.target.checked)}
          />
        </div>

        <div className="filterBox">
          <h6>Filter by rating</h6>
          <ul className="rating">
            {RATING_OPTIONS.map((ratingValue) => (
              <li key={ratingValue}>
                <button
                  type="button"
                  className={`ratingBtn ${minRating === ratingValue ? 'active' : ''}`}
                  onClick={() =>
                    onMinRatingChange(minRating === ratingValue ? 0 : ratingValue)
                  }
                >
                  <Rating name={`rating-${ratingValue}`} value={ratingValue} readOnly />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {promoProducts.length > 0 && (
          <div className="sidebarPromos">
            {promoProducts.slice(0, 2).map((product, index) => {
              const imageUrl = getProductImage(product);

              return (
                <Link
                  to={`/product/${product.id}`}
                  className="sidebarPromoCard"
                  key={`sidebar-promo-${product.id}`}
                >
                  <div className="promoCopy">
                    <span>{index === 0 ? 'Featured' : 'Fresh deal'}</span>
                    <h4>{product.title}</h4>
                    <strong>Shop now</strong>
                  </div>

                  <div className="promoMedia">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.title} />
                    ) : (
                      <div className="promoMediaPlaceholder" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
