import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

import { IoShirtOutline } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiDiscount1 } from "react-icons/ci";
import { MdDoneAll } from "react-icons/md";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  const facebookLink = "https://www.facebook.com/thanhphuocjr/";
  const instagramLink = "https://www.instagram.com/_ntp_jr/";
  const tiktokLink = "https://www.tiktok.com/@_ntp_jr";
  const youtubeLink = "https://www.youtube.com/@thanhphuocjr";
  return (
    <footer>
      <div className="container">
        <div className="topInfo row">
          <div className="col d-flex align-items-center ">
            <span>
              <IoShirtOutline />
            </span>
            <span className="ml-2">Everyday fresh products</span>
          </div>
          <div className="col d-flex align-items-center ">
            <span>
              <CiDeliveryTruck />
            </span>
            <span className="ml-2">Free delivery for order over $70</span>
          </div>
          <div className="col d-flex align-items-center ">
            <span>
              <CiDiscount1 />
            </span>
            <span className="ml-2">Daily Mega Discounts</span>
          </div>
          <div className="col d-flex align-items-center ">
            <span>
              <MdDoneAll />
            </span>
            <span className="ml-2">Best price on the market</span>
          </div>
        </div>

        <div className="midInfo row mt-4">
          <div className="col">
            <h5>Fruit & Vegetable</h5>
            <ul>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Fresh Fruits</Link>
              </li>
              <li>
                <Link to="#">Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to="#">Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to="#">Packaged Produce</Link>
              </li>
              <li>
                <Link to="#">Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>BREAKFAST & DAIRY</h5>
            <ul>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Fresh Fruits</Link>
              </li>
              <li>
                <Link to="#">Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to="#">Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to="#">Packaged Produce</Link>
              </li>
              <li>
                <Link to="#">Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>MEAT & SEAFOOD</h5>
            <ul>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Fresh Fruits</Link>
              </li>
              <li>
                <Link to="#">Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to="#">Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to="#">Packaged Produce</Link>
              </li>
              <li>
                <Link to="#">Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>BEVERAGES</h5>
            <ul>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Fresh Fruits</Link>
              </li>
              <li>
                <Link to="#">Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to="#">Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to="#">Packaged Produce</Link>
              </li>
              <li>
                <Link to="#">Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>BREADS & BAKERY</h5>
            <ul>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to="#">Fresh Vegetables</Link>
              </li>
              <li>
                <Link to="#">Fresh Fruits</Link>
              </li>
              <li>
                <Link to="#">Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to="#">Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to="#">Packaged Produce</Link>
              </li>
              <li>
                <Link to="#">Party Trays</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="botInfo row mt-3 pt-3 pb-3 d-flex">
          <p className="mb-0">Copyright 2025. All rights reserved</p>

          <ul className="list list-inline">
            <li className="list-inline-item">
              <Link to={facebookLink} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link
                to={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to={youtubeLink} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to={tiktokLink} target="_blank" rel="noopener noreferrer">
                <FaTiktok />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
