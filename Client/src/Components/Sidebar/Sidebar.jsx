import React, { use, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./Sidebar.scss";

import { Link } from "react-router-dom";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

import banner1 from "../../assets/images/BannerColumn/b1.jpg";
import banner2 from "../../assets/images/BannerColumn/b2.jpg";

const Sidebar = () => {
  const [value, setValue] = useState([100, 60000]);
  const [value2, setValue2] = useState(0);

  return (
    <div className="sidebar">
      <div className="sticky">
        {/* Product */}
        <div className="filterBox">
          <h6>Product Categories</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Men"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Women"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Laptops"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Accessories"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Cameras"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Men Bags"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Women Bags"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Men Footwear"
                  className="w-100"
                />
              </li>
              <li>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Women Footwear"
                  className="w-100"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Filter By Price */}
        <div className="filterBox  ">
          <h6 className="mb-3">Filter By Price</h6>

          <RangeSlider
            value={value}
            onInput={setValue}
            min={100}
            max={60000}
            step={5}
          />
          <div className="d-flex pt-2 pb-2 priceRange normal_text ">
            <span>
              From: <strong className="text-dark">Rs:{value[0]}</strong>
            </span>
            <span className="ml-auto">
              To: <strong className="text-dark">Rs:{value[1]}</strong>
            </span>
          </div>
        </div>

        {/* ProductStatus */}
        <div className="filterBox">
          <h6>Product Categories</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="In Stock"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="On Sale"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Filter by rating */}
        <div className="filterBox">
          <h6>Filter by rating</h6>
          <ul className="rating">
            <li>
              <Rating name="read-only" value={5} readOnly />
            </li>
            <li>
              <Rating name="read-only" value={4} readOnly />
            </li>
            <li>
              <Rating name="read-only" value={3} readOnly />
            </li>
            <li>
              <Rating name="read-only" value={2} readOnly />
            </li>
            <li>
              <Rating name="read-only" value={1} readOnly />
            </li>
          </ul>
        </div>

        {/* Filter by brand */}
        <div className="filterBox">
          <h6>Brands</h6>
          <div className="scroll">
            <ul>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="NTP"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="NNA"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="TTH"
                />
              </li>
              <li>
                <FormControlLabel
                  className="w-100"
                  control={<Checkbox />}
                  label="NTD"
                />
              </li>
            </ul>
          </div>
        </div>
        <br />

        {/* Banner */}
        <div className="banner">
          <Link to="#">
            <img className="w-100 mb-2" src={banner1} alt="" />
          </Link>
          <Link to="#">
            <img className="w-100 mb-2" src={banner2} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
