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
  }, [categories.length]);

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

              {categories.map((category) => (
                <li key={`sidebar-category-${category.id}`}>
                  <Link
                    to={`/cat/${category.id}`}
                    onClick={() => setIsOpenSidebarNav(false)}
                  >
                    <Button>
                      <FaTags />
                      {formatCategoryName(category.name)}
                    </Button>
                  </Link>
                </li>
              ))}
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

              {categories.map((category) => (
                <li className="list-inline-item" key={`top-category-${category.id}`}>
                  <Link
                    to={`/cat/${category.id}`}
                    className={
                      Number(selectedCategoryId) === Number(category.id)
                        ? 'active'
                        : ''
                    }
                  >
                    <FaTags />
                    {formatCategoryName(category.name)}
                  </Link>
                </li>
              ))}
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
