import { getUserInformation } from './auth';

export const CART_UPDATED_EVENT = 'cart:updated';

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const getCurrentUserId = () => {
  const user = getUserInformation();
  return user?.id || user?.email || 'guest';
};

const getCartKey = () => `ecom_cart_${getCurrentUserId()}`;

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

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

const getSalePrice = (product) => {
  const originalPrice = toNumber(product?.price);
  const salePrice = toNumber(product?.sale_price, originalPrice);
  return salePrice > 0 ? salePrice : originalPrice;
};

export const getCartItems = () => {
  try {
    const rawCart = localStorage.getItem(getCartKey());
    const items = rawCart ? JSON.parse(rawCart) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    localStorage.removeItem(getCartKey());
    return [];
  }
};

export const saveCartItems = (items) => {
  localStorage.setItem(getCartKey(), JSON.stringify(items));
  notifyCartUpdated();
};

export const addToCart = (product, quantity = 1) => {
  const productId = Number(product?.id);

  if (!productId) {
    throw new Error('Invalid product.');
  }

  const items = getCartItems();
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const existingIndex = items.findIndex(
    (item) => Number(item.productId) === productId,
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + nextQuantity,
    };
  } else {
    items.push({
      productId,
      title: product.title,
      image: getProductImage(product),
      unitPrice: getSalePrice(product),
      originalPrice: toNumber(product.price),
      quantity: nextQuantity,
      stock: toNumber(product.stock, 999),
    });
  }

  saveCartItems(items);
  return items;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const items = getCartItems().map((item) =>
    Number(item.productId) === Number(productId)
      ? { ...item, quantity: nextQuantity }
      : item,
  );

  saveCartItems(items);
  return items;
};

export const removeCartItem = (productId) => {
  const items = getCartItems().filter(
    (item) => Number(item.productId) !== Number(productId),
  );
  saveCartItems(items);
  return items;
};

export const clearCart = () => {
  localStorage.removeItem(getCartKey());
  notifyCartUpdated();
};

export const getCartSummary = () => {
  const items = getCartItems();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  return {
    items,
    itemCount,
    subtotal,
    shippingFee: 0,
    total: subtotal,
  };
};

