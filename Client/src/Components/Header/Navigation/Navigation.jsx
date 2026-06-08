import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTags } from 'react-icons/fa';
import { FaAngleRight, FaAngleDown, FaAngleLeft } from 'react-icons/fa6';
import { getCategories } from '../../../Api/products';
import './Navigation.scss';

const formatCategoryName = (name = '') =>
  name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeCategoryName = (name = '') =>
  name.trim().toLowerCase().replace(/[\s_]+/g, '-');

const CATEGORY_GROUPS = [
  {
    key: 'fashion',
    label: 'Fashion',
    names: [
      'mens-shirts',
      'mens-shoes',
      'womens-bags',
      'womens-dresses',
      'womens-jewellery',
      'womens-shoes',
      'tops',
    ],
  },
  {
    key: 'watches',
    label: 'Watches',
    names: ['mens-watches', 'womens-watches'],
  },
  {
    key: 'electronics',
    label: 'Electronics',
    names: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
  },
  {
    key: 'home-kitchen',
    label: 'Home & Kitchen',
    names: ['furniture', 'home-decoration', 'kitchen-accessories'],
  },
  {
    key: 'beauty-care',
    label: 'Beauty & Care',
    names: ['beauty', 'fragrances', 'skin-care', 'skincare'],
  },
  {
    key: 'groceries',
    label: 'Groceries',
    names: ['groceries'],
  },
  {
    key: 'motors',
    label: 'Motors',
    names: ['automotive', 'motorcycle'],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    names: ['sunglasses', 'sports-accessories'],
  },
];

const buildCategoryGroups = (categories = []) => {
  const usedCategoryIds = new Set();

  const groupedCategories = CATEGORY_GROUPS.map((group) => ({
    ...group,
    categories: group.names
      .map((categoryName) =>
        categories.find(
          (category) =>
            normalizeCategoryName(category.name) ===
            normalizeCategoryName(categoryName),
        ),
      )
      .filter(Boolean),
  })).filter((group) => group.categories.length > 0);

  groupedCategories.forEach((group) => {
    group.categories.forEach((category) => usedCategoryIds.add(category.id));
  });

  const otherGroups = categories
    .filter((category) => !usedCategoryIds.has(category.id))
    .map((category) => ({
      key: `category-${category.id}`,
      label: formatCategoryName(category.name),
      categories: [category],
    }));

  return [...groupedCategories, ...otherGroups];
};

const Navigation = () => {
  const location = useLocation();
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);
  const [categories, setCategories] = useState([]);
  const navScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const selectedCategoryId = useMemo(() => {
    const matched = location.pathname.match(/^\/cat\/(\d+)/);
    return matched ? Number(matched[1]) : null;
  }, [location.pathname]);

  const categoryGroups = useMemo(
    () => buildCategoryGroups(categories),
    [categories],
  );

  const updateScrollButtons = () => {
    const scrollNode = navScrollRef.current;
    if (!scrollNode) {
      return;
    }

    setCanScrollLeft(scrollNode.scrollLeft > 0);
    setCanScrollRight(
      scrollNode.scrollLeft + scrollNode.clientWidth < scrollNode.scrollWidth - 1,
    );
  };

  useEffect(() => {
    updateScrollButtons();

    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categoryGroups.length]);

  const handleScrollNav = (direction) => {
    const scrollNode = navScrollRef.current;
    if (!scrollNode) {
      return;
    }

    const scrollStep = 260;
    scrollNode.scrollBy({
      left: direction === 'right' ? scrollStep : -scrollStep,
      behavior: 'smooth',
    });
  };

  return (
    <div className="row w-100 mr-auto ml-auto">
      <div className="col-sm-2 navCartPart1 d-flex align-items-center">
        <div className="cartWrapper">
          <Button
            className="allCartTab align-items-center w-100"
            onClick={() => setIsOpenSidebarNav((prev) => !prev)}
          >
            <span className="mr-2">
              {isOpenSidebarNav ? <FaAngleDown /> : <FaAngleRight />}
            </span>
            <span className="text">ALL CATEGORIES</span>
          </Button>

          <div className={`sideBarNav shadow ${isOpenSidebarNav ? 'open' : ''}`}>
            <ul>
              <li>
                <Link to="/products" onClick={() => setIsOpenSidebarNav(false)}>
                  <Button>
                    <FaTags />
                    All Products
                  </Button>
                </Link>
              </li>

              {categoryGroups.map((group) => {
                const isGrouped = group.categories.length > 1;
                const isActiveGroup = group.categories.some(
                  (category) => Number(selectedCategoryId) === Number(category.id),
                );

                if (!isGrouped) {
                  const category = group.categories[0];

                  return (
                    <li key={`sidebar-category-${category.id}`}>
                      <Link
                        to={`/cat/${category.id}`}
                        onClick={() => setIsOpenSidebarNav(false)}
                      >
                        <Button className={isActiveGroup ? 'active' : ''}>
                          <FaTags />
                          {formatCategoryName(category.name)}
                        </Button>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li className="sideGroupItem" key={`sidebar-group-${group.key}`}>
                    <Button className={isActiveGroup ? 'active' : ''}>
                      <FaTags />
                      {group.label}
                      <FaAngleRight className="groupArrow" />
                    </Button>

                    <div className="sideGroupDropdown">
                      {group.categories.map((category) => (
                        <Link
                          key={`sidebar-group-category-${category.id}`}
                          to={`/cat/${category.id}`}
                          onClick={() => setIsOpenSidebarNav(false)}
                          className={
                            Number(selectedCategoryId) === Number(category.id)
                              ? 'active'
                              : ''
                          }
                        >
                          {formatCategoryName(category.name)}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="col-sm-10 navCartPart2 d-flex align-items-center">
        <div className="navScroller w-100 d-flex align-items-center">
          <Button
            className="scrollBtn prev"
            onClick={() => handleScrollNav('left')}
            disabled={!canScrollLeft}
          >
            <FaAngleLeft />
          </Button>

          <div
            className="navScrollViewport"
            ref={navScrollRef}
            onScroll={updateScrollButtons}
          >
            <ul className="list list-inline d-flex w-100 ml-auto mr-auto">
              <li className="list-inline-item">
                <Link to="/">
                  <FaHome /> Home
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="/products" className={!selectedCategoryId ? 'active' : ''}>
                  <FaTags /> All Products
                </Link>
              </li>

              {categoryGroups.map((group) => {
                const isGrouped = group.categories.length > 1;
                const isActiveGroup = group.categories.some(
                  (category) => Number(selectedCategoryId) === Number(category.id),
                );

                if (!isGrouped) {
                  const category = group.categories[0];

                  return (
                    <li
                      className="list-inline-item"
                      key={`top-category-${category.id}`}
                    >
                      <Link
                        to={`/cat/${category.id}`}
                        className={isActiveGroup ? 'active' : ''}
                      >
                        <FaTags />
                        {formatCategoryName(category.name)}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    className="list-inline-item navGroupItem"
                    key={`top-group-${group.key}`}
                  >
                    <button
                      type="button"
                      className={`navGroupTrigger ${isActiveGroup ? 'active' : ''}`}
                    >
                      <FaTags />
                      {group.label}
                      <FaAngleDown className="groupArrow" />
                    </button>

                    <div className="navGroupDropdown">
                      {group.categories.map((category) => (
                        <Link
                          key={`top-group-category-${category.id}`}
                          to={`/cat/${category.id}`}
                          className={
                            Number(selectedCategoryId) === Number(category.id)
                              ? 'active'
                              : ''
                          }
                        >
                          {formatCategoryName(category.name)}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button
            className="scrollBtn next"
            onClick={() => handleScrollNav('right')}
            disabled={!canScrollRight}
          >
            <FaAngleRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
