import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import './Sidebar.scss';

import { Link } from 'react-router-dom';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import Rating from '@mui/material/Rating';

import banner1 from '../../assets/images/BannerColumn/b1.jpg';
import banner2 from '../../assets/images/BannerColumn/b2.jpg';

const RATING_OPTIONS = [5, 4, 3, 2, 1];
const formatCategoryName = (name = '') =>
  name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Sidebar = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  priceRange = [0, 1000],
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  minRating,
  onMinRatingChange,
}) => {
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
            value={priceRange}
            onInput={onPriceRangeChange}
            min={0}
            max={5000}
            step={10}
          />

          <div className="d-flex pt-2 pb-2 priceRange normal_text">
            <span>
              From: <strong className="text-dark">${priceRange[0]}</strong>
            </span>
            <span className="ml-auto">
              To: <strong className="text-dark">${priceRange[1]}</strong>
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

        <div className="banner">
          <Link to="#">
            <img className="w-100 mb-2" src={banner1} alt="promo 1" />
          </Link>
          <Link to="#">
            <img className="w-100 mb-2" src={banner2} alt="promo 2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
