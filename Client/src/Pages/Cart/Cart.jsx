import React from "react";

import "./Cart.scss";

import Rating from "@mui/material/Rating";

import { CiCircleRemove } from "react-icons/ci";
import { FaCartArrowDown } from "react-icons/fa";

import { Link } from "react-router-dom";

import QuantityBox from "../../Components/QuantityBox/QuantityBox";
import Button from "@mui/material/Button";
const Cart = () => {
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <h2 className="title">Your Cart</h2>
              <span className="note text-light1  ">
                Quantity: 3 products in your cart
              </span>

              <div className="table_responsive mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link to="/product/1">
                          <div className="product_thumbnail">
                            <img
                              src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-57-600x600.jpg"
                              alt=""
                              className="w-100"
                            />
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link to="/product/1">
                          <div className="d-flex align-items-center product_name ">
                            <h6>Fresh Organic Broccoli Crowns</h6>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <div className="price text-light1">
                          <span>$4.75</span>
                        </div>
                      </td>
                      <td>
                        <div className="amount d-flex">
                          <QuantityBox />
                        </div>
                      </td>
                      <td>
                        <div className="subTotal">
                          <span>$14.55</span>
                        </div>
                      </td>
                      <td>
                        <div className="remove">
                          <CiCircleRemove />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="/product/1">
                          <div className="product_thumbnail">
                            <img
                              src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-57-600x600.jpg"
                              alt=""
                              className="w-100"
                            />
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link to="/product/1">
                          <div className="d-flex align-items-center product_name ">
                            <h6>Fresh Organic Broccoli Crowns</h6>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <div className="price text-light1">
                          <span>$4.75</span>
                        </div>
                      </td>
                      <td>
                        <div className="amount d-flex">
                          <QuantityBox />
                        </div>
                      </td>
                      <td>
                        <div className="subTotal">
                          <span>$14.55</span>
                        </div>
                      </td>
                      <td>
                        <div className="remove">
                          <CiCircleRemove />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="/product/1">
                          <div className="product_thumbnail">
                            <img
                              src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-57-600x600.jpg"
                              alt=""
                              className="w-100"
                            />
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link to="/product/1">
                          <div className="d-flex align-items-center product_name ">
                            <h6>Fresh Organic Broccoli Crowns</h6>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <div className="price text-light1">
                          <span>$4.75</span>
                        </div>
                      </td>
                      <td>
                        <div className="amount d-flex">
                          <QuantityBox />
                        </div>
                      </td>
                      <td>
                        <div className="subTotal">
                          <span>$14.55</span>
                        </div>
                      </td>
                      <td>
                        <div className="remove">
                          <CiCircleRemove />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="/product/1">
                          <div className="product_thumbnail">
                            <img
                              src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-57-600x600.jpg"
                              alt=""
                              className="w-100"
                            />
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link to="/product/1">
                          <div className="d-flex align-items-center product_name ">
                            <h6>Fresh Organic Broccoli Crowns</h6>
                          </div>
                        </Link>
                      </td>

                      <td>
                        <div className="price text-light1">
                          <span>$4.75</span>
                        </div>
                      </td>
                      <td>
                        <div className="amount d-flex">
                          <QuantityBox />
                        </div>
                      </td>
                      <td>
                        <div className="subTotal">
                          <span>$14.55</span>
                        </div>
                      </td>
                      <td>
                        <div className="remove">
                          <CiCircleRemove />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="actions">
                        <div className="actions-inner d-flex justify-content-between align-items-center">
                          <div className="d-flex action_wrapper align-items-center">
                            <div className="coupon">
                              <input
                                type="text"
                                placeholder="Coupon code"
                                className="mr-3"
                              />
                            </div>
                            <Button className="apply"> Apply</Button>
                          </div>
                          <Button className="remove_all">Remove All</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cart_details p-4 w-100">
                <h4>Cart Totals</h4>

                <div className="d-flex  align-items-center mb-3 mt-4 sub">
                  <span className>Subtotal</span>
                  <span className="ml-auto">$143.97</span>
                </div>
                <div className="d-flex  align-items-center mb-3 ship">
                  <span>Shipping:</span>
                  <span className="ml-auto">FREE</span>
                </div>
                <div className="d-flex  align-items-center mb-3 estimate">
                  <span>Estimate for: </span>
                  <span className="ml-auto">VND</span>
                </div>
                <div className="d-flex  align-items-center mb-3 total">
                  <span>Total: </span>
                  <span className="ml-auto">$143.97</span>
                </div>
                <Button>
                  <FaCartArrowDown className="mr-2" />
                  <span>Proceed to checkout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
