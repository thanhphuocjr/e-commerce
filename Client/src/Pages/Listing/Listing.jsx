import React, { useState } from "react";
import "./Listing.scss";
import ProductItem from "../../Components/ProductItem/ProductItem";
import Sidebar from "../../Components/Sidebar/Sidebar";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { IoIosMenu } from "react-icons/io"; //1
import { TfiLayoutGrid2 } from "react-icons/tfi"; //2
import { TfiLayoutGrid3 } from "react-icons/tfi"; //3
import { TfiLayoutGrid4 } from "react-icons/tfi"; //4

import { FaAngleDown } from "react-icons/fa6"; //Down

import banner1 from "../../assets/images/Banner/Banner-3.jpg";

const Listing = () => {
  const [productView, setProductView] = useState("one");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className="product_Listing_Page">
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar />
          <div className="content_right">
            {/* Banner */}
            <div className="banner ">
              <img className="w-100" src={banner1} alt="" />
            </div>

            {/* Show By */}
            <div className="showBy mt-3 mb-3 d-flex align-items-center ">
              {/* GridWrapper */}
              <div className="d-flex gridWrapper ">
                <Button
                  className={productView === "one" && "act"}
                  onClick={() => setProductView("one")}
                >
                  <IoIosMenu />
                </Button>
                <Button
                  className={productView === "two" && "act"}
                  onClick={() => setProductView("two")}
                >
                  <TfiLayoutGrid2 />
                </Button>
                <Button
                  className={productView === "three" && "act"}
                  onClick={() => setProductView("three")}
                >
                  <TfiLayoutGrid3 />
                </Button>
                <Button
                  className={productView === "four" && "act"}
                  onClick={() => setProductView("four")}
                >
                  <TfiLayoutGrid4 />
                </Button>
              </div>

              {/* Show ?  */}
              <div className="ml-auto  showByFilter ">
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Show 9 <FaAngleDown className="ml-1" />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>10</MenuItem>
                  <MenuItem onClick={handleClose}>20</MenuItem>
                  <MenuItem onClick={handleClose}>30</MenuItem>
                  <MenuItem onClick={handleClose}>40</MenuItem>
                  <MenuItem onClick={handleClose}>50</MenuItem>
                  <MenuItem onClick={handleClose}>60</MenuItem>
                </Menu>
              </div>
            </div>

            {/* ProductListing */}
            <div className="productListing">
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
              <ProductItem itemView={productView} />
            </div>

            {/* Pagination */}
            <div className="d-flex align-items-center justify-content-center mt-5">
              <Pagination
                count={10}
                variant="outlined"
                color="primary"
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
