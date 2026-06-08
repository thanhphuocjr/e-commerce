import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Listing.scss';
import ProductItem from '../../Components/ProductItem/ProductItem';
import Sidebar from '../../Components/Sidebar/Sidebar';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

import { IoIosArrowRoundForward, IoIosMenu } from 'react-icons/io';
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa6';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getCategories, getProducts } from '../../Api/products';

const LIMIT_OPTIONS = [12, 24, 36, 48];
const GRID_OPTIONS = ['one', 'two', 'three', 'four'];
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

const formatCategoryName = (name = '') =>
  name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Listing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [productView, setProductView] = useState('four');
  const [anchorEl, setAnchorEl] = useState(null);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') || '').trim();
  }, [location.search]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) {
      return null;
    }

    return (
      categories.find(
        (category) => Number(category.id) === Number(selectedCategoryId),
      ) || null
    );
  }, [categories, selectedCategoryId]);

  const selectedCategoryName = selectedCategory?.name || undefined;
  const promoProducts = useMemo(
    () =>
      products
        .map((product) => ({
          id: product.id,
          title: product.title,
          image: getProductImage(product),
        }))
        .filter((product) => product.image)
        .slice(0, 3),
    [products],
  );
  const promoTitle = searchTerm
    ? `Deals for "${searchTerm}"`
    : selectedCategoryName
      ? `${formatCategoryName(selectedCategoryName)} deals`
      : 'Fresh deals for today';

  useEffect(() => {
    if (!id || id === 'all') {
      setSelectedCategoryId(null);
      return;
    }

    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      setSelectedCategoryId(numericId);
    }
  }, [id]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (loadError) {
        setError('Failed to load categories.');
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        if (selectedCategoryId && categories.length > 0 && !selectedCategoryName) {
          if (isMounted) {
            setProducts([]);
            setPagination({ page: 1, limit, total: 0, totalPages: 1 });
          }
          return;
        }

        const params = {
          page,
          limit,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          inStock: inStockOnly || undefined,
          minRating: minRating || undefined,
          search: searchTerm || undefined,
          category: selectedCategoryName,
        };

        const response = await getProducts(params);

        if (!isMounted) {
          return;
        }

        setProducts(response.items);
        setPagination(response.pagination);
      } catch (loadError) {
        if (isMounted) {
          setError('Failed to load product list.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [
    page,
    limit,
    priceRange,
    inStockOnly,
    minRating,
    searchTerm,
    selectedCategoryName,
    selectedCategoryId,
    categories.length,
  ]);

  const open = Boolean(anchorEl);

  const handleCategoryChange = useCallback(
    (categoryId) => {
      const targetPath = categoryId ? `/cat/${categoryId}` : '/products';
      navigate(`${targetPath}${location.search}`);
      setPage(1);
    },
    [location.search, navigate],
  );

  const handlePriceRangeChange = useCallback((value) => {
    setPriceRange(value);
    setPage(1);
  }, []);

  const handleInStockOnlyChange = useCallback((value) => {
    setInStockOnly(value);
    setPage(1);
  }, []);

  const handleMinRatingChange = useCallback((value) => {
    setMinRating(value);
    setPage(1);
  }, []);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    setAnchorEl(null);
  };

  return (
    <section className="product_Listing_Page">
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategoryChange}
            promoProducts={products}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={handleInStockOnlyChange}
            minRating={minRating}
            onMinRatingChange={handleMinRatingChange}
          />

          <div className="content_right">
            <div className="listingPromo">
              <div className="promoCopy">
                <span className="promoEyebrow">Limited offers</span>
                <h1>{promoTitle}</h1>
                <p>Updated picks, clear prices, and products ready to ship.</p>
                <Button onClick={() => navigate('/products')}>
                  Shop now
                  <IoIosArrowRoundForward />
                </Button>
              </div>

              <div className="promoProducts" aria-label="Featured products">
                {promoProducts.length > 0 ? (
                  promoProducts.map((product, index) => (
                    <div
                      className={`promoProduct promoProduct${index + 1}`}
                      key={`promo-product-${product.id}`}
                    >
                      <img src={product.image} alt={product.title} />
                    </div>
                  ))
                ) : (
                  <div className="promoPlaceholder" />
                )}
              </div>
            </div>

            <div className="showBy mt-3 mb-3 d-flex align-items-center">
              <div className="d-flex gridWrapper">
                <Button
                  className={productView === GRID_OPTIONS[0] ? 'act' : ''}
                  onClick={() => setProductView(GRID_OPTIONS[0])}
                >
                  <IoIosMenu />
                </Button>
                <Button
                  className={productView === GRID_OPTIONS[1] ? 'act' : ''}
                  onClick={() => setProductView(GRID_OPTIONS[1])}
                >
                  <TfiLayoutGrid2 />
                </Button>
                <Button
                  className={productView === GRID_OPTIONS[2] ? 'act' : ''}
                  onClick={() => setProductView(GRID_OPTIONS[2])}
                >
                  <TfiLayoutGrid3 />
                </Button>
                <Button
                  className={productView === GRID_OPTIONS[3] ? 'act' : ''}
                  onClick={() => setProductView(GRID_OPTIONS[3])}
                >
                  <TfiLayoutGrid4 />
                </Button>
              </div>

              <div className="showByMeta ml-3">
                <span>
                  {pagination.total} product{pagination.total > 1 ? 's' : ''}
                  {searchTerm ? ` for "${searchTerm}"` : ''}
                </span>
              </div>

              <div className="ml-auto showByFilter">
                <Button
                  id="show-limit-button"
                  aria-controls={open ? 'show-limit-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  Show {limit} <FaAngleDown className="ml-1" />
                </Button>

                <Menu
                  id="show-limit-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'show-limit-button',
                    },
                  }}
                >
                  {LIMIT_OPTIONS.map((limitOption) => (
                    <MenuItem
                      key={limitOption}
                      onClick={() => handleLimitChange(limitOption)}
                    >
                      {limitOption}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            {loading && <p className="text-light1">Loading products...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
              <div className="productListing">
                {products.map((product) => (
                  <ProductItem
                    key={`listing-product-${product.id}`}
                    itemView={productView}
                    product={product}
                  />
                ))}

                {products.length === 0 && (
                  <div className="emptyState">No products match your filters.</div>
                )}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  variant="outlined"
                  color="primary"
                  size="large"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
