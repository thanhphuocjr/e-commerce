import React, { useMemo, useState } from 'react';
import './Cart.scss';

import { CiCircleRemove } from 'react-icons/ci';
import { FaCartArrowDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import QuantityBox from '../../Components/QuantityBox/QuantityBox';
import Button from '@mui/material/Button';
import {
  clearCart,
  getCartSummary,
  removeCartItem,
  updateCartItemQuantity,
} from '../../Api/cart';
import { checkoutBooking } from '../../Api/checkout';
import { getUserInformation } from '../../Api/auth';

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Cart = () => {
  const navigate = useNavigate();
  const user = getUserInformation();
  const [cartSummary, setCartSummary] = useState(getCartSummary());
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: user?.fullName || user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'mock-card',
  });
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutResult, setCheckoutResult] = useState(null);

  const hasItems = cartSummary.items.length > 0;

  const checkoutItems = useMemo(
    () =>
      cartSummary.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [cartSummary.items],
  );

  const reloadCart = () => {
    setCartSummary(getCartSummary());
  };

  const handleQuantityChange = (productId, quantity) => {
    updateCartItemQuantity(productId, quantity);
    reloadCart();
  };

  const handleRemoveItem = (productId) => {
    removeCartItem(productId);
    reloadCart();
  };

  const handleClearCart = () => {
    clearCart();
    reloadCart();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!hasItems || checkingOut) {
      return;
    }

    try {
      setCheckingOut(true);
      setCheckoutError('');
      setCheckoutResult(null);

      const result = await checkoutBooking({
        items: checkoutItems,
        ...checkoutForm,
        currency: 'USD',
      });

      clearCart();
      setCartSummary(getCartSummary());
      setCheckoutResult(result);
    } catch (error) {
      setCheckoutError(
        error.response?.data?.message ||
          error.message ||
          'Checkout failed. Please try again.',
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const confirmedBooking = checkoutResult?.booking;
  const confirmedPayment = checkoutResult?.payment;

  return (
    <section className="section cartPage">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <h2 className="title">Your Cart</h2>
            <span className="note text-light1">
              Quantity: {cartSummary.itemCount} product(s) in your cart
            </span>

            {!hasItems && !confirmedBooking ? (
              <div className="emptyCart mt-4">
                <h5>Your cart is empty</h5>
                <p>Add products to your cart before checkout.</p>
                <Button onClick={() => navigate('/products')}>Browse products</Button>
              </div>
            ) : null}

            {hasItems && (
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
                    {cartSummary.items.map((item) => (
                      <tr key={item.productId}>
                        <td>
                          <Link to={`/product/${item.productId}`}>
                            <div className="product_thumbnail">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-100"
                                />
                              ) : (
                                <div className="noImage">No image</div>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/product/${item.productId}`}>
                            <div className="d-flex align-items-center product_name">
                              <h6>{item.title}</h6>
                            </div>
                          </Link>
                        </td>

                        <td>
                          <div className="price text-light1">
                            <span>{formatCurrency(item.unitPrice)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="amount d-flex">
                            <QuantityBox
                              value={item.quantity}
                              max={item.stock || 99}
                              onChange={(quantity) =>
                                handleQuantityChange(item.productId, quantity)
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div className="subTotal">
                            <span>
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="remove"
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <CiCircleRemove />
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={6} className="actions">
                        <div className="actions-inner d-flex justify-content-between align-items-center">
                          <div className="d-flex action_wrapper align-items-center">
                            <div className="coupon">
                              <input
                                type="text"
                                placeholder="Coupon code"
                                className="mr-3"
                                disabled
                              />
                            </div>
                            <Button className="apply" disabled>
                              Apply
                            </Button>
                          </div>
                          <Button className="remove_all" onClick={handleClearCart}>
                            Remove All
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {confirmedBooking && (
              <div className="checkoutSuccess mt-4">
                <h5>Payment completed</h5>
                <p>
                  Booking <b>#{confirmedBooking.id}</b> was created with status{' '}
                  <b>{confirmedBooking.status}</b>.
                </p>
                {confirmedPayment && (
                  <p>
                    Payment <b>#{confirmedPayment.id}</b> is{' '}
                    <b>{confirmedPayment.status}</b>.
                  </p>
                )}
                <Button onClick={() => navigate('/products')}>
                  Continue shopping
                </Button>
              </div>
            )}
          </div>

          <div className="col-md-3">
            <div className="cart_details p-4 w-100">
              <h4>Cart Totals</h4>

              <div className="d-flex align-items-center mb-3 mt-4 sub">
                <span>Subtotal</span>
                <span className="ml-auto">{formatCurrency(cartSummary.subtotal)}</span>
              </div>
              <div className="d-flex align-items-center mb-3 ship">
                <span>Shipping:</span>
                <span className="ml-auto">FREE</span>
              </div>
              <div className="d-flex align-items-center mb-3 estimate">
                <span>Currency:</span>
                <span className="ml-auto">USD</span>
              </div>
              <div className="d-flex align-items-center mb-3 total">
                <span>Total:</span>
                <span className="ml-auto">{formatCurrency(cartSummary.total)}</span>
              </div>

              <div className="checkoutForm">
                <label>
                  Name
                  <input
                    name="customerName"
                    value={checkoutForm.customerName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email
                  <input
                    name="customerEmail"
                    value={checkoutForm.customerEmail}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="customerPhone"
                    value={checkoutForm.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                  />
                </label>
                <label>
                  Address
                  <textarea
                    name="shippingAddress"
                    value={checkoutForm.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Delivery address"
                    rows={3}
                  />
                </label>
                <label>
                  Payment
                  <select
                    name="paymentMethod"
                    value={checkoutForm.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="mock-card">Mock card payment</option>
                    <option value="cash-on-delivery">Cash on delivery</option>
                  </select>
                </label>
              </div>

              {checkoutError && <p className="checkoutError">{checkoutError}</p>}

              <Button onClick={handleCheckout} disabled={!hasItems || checkingOut}>
                <FaCartArrowDown className="mr-2" />
                <span>{checkingOut ? 'Processing...' : 'Proceed to checkout'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
