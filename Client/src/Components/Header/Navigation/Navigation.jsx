import React, { useState } from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaTshirt } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import { BsBagHeart } from 'react-icons/bs';
import { GiWingfoot } from 'react-icons/gi';
import { CiShop } from 'react-icons/ci';
import { CiFaceSmile } from 'react-icons/ci';
import { CgGym } from 'react-icons/cg';
import './Navigation.scss';

import { FaAngleRight } from 'react-icons/fa6';
import { FaAngleDown } from 'react-icons/fa6';
import { IoReorderThree } from 'react-icons/io5';

const Navigation = () => {
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);
  const handleOnClickSideBar = () => {
    setIsOpenSidebarNav(!isOpenSidebarNav);
  };

  return (
    <div className="row w-100 mr-auto ml-auto ">
      <div className="col-sm-2 navCartPart1 d-flex align-items-center">
        <div className="cartWrapper">
          <Button
            className="allCartTab align-items-center w-100 "
            onClick={handleOnClickSideBar}
          >
            <span className="mr-2">
              {isOpenSidebarNav ? <FaAngleDown /> : <FaAngleRight />}
            </span>
            <span className="text">ALL CATEGORIES</span>
          </Button>

          <div
            className={`sideBarNav shadow ${
              isOpenSidebarNav === true ? 'open' : ''
            } `}
          >
            <ul>
              <li>
                <Link to="/">
                  <Button>
                    <FaTshirt />
                    Fashion
                    <FaAngleDown className="icon icon-down" />
                    <FaAngleRight className="icon icon-right" />
                  </Button>
                </Link>
                <div className="submenu">
                  <Link to="/">
                    <Button>men</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>women</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>others</Button>{' '}
                  </Link>
                </div>
              </li>

              <li>
                <Link to="/">
                  <Button>
                    {' '}
                    <MdElectricBolt />
                    Electronics
                    <FaAngleDown className="icon icon-down" />
                    <FaAngleRight className="icon icon-right" />
                  </Button>
                </Link>
                <div className="submenu ">
                  <Link to="/">
                    <Button>Laptops</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Smart Watch</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Cameras</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Accessories</Button>{' '}
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/">
                  <Button>
                    <BsBagHeart />
                    Bags
                    <FaAngleDown className="icon icon-down" />
                    <FaAngleRight className="icon icon-right" />
                  </Button>
                </Link>
                <div className="submenu ">
                  <Link to="/">
                    <Button>Men Bags</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Women Bags</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Child Bags</Button>{' '}
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/">
                  <Button>
                    <GiWingfoot />
                    FootWear
                    <FaAngleDown className="icon icon-down" />
                    <FaAngleRight className="icon icon-right" />
                  </Button>
                </Link>
                <div className="submenu ">
                  <Link to="/">
                    <Button>Men FootWears</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Women FootWears</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>Child FootWears</Button>{' '}
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/">
                  <Button>
                    <CiShop />
                    Groceries
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <Button>
                    <CiFaceSmile />
                    Beauty
                    <FaAngleDown className="icon icon-down" />
                    <FaAngleRight className="icon icon-right" />
                  </Button>
                </Link>
                <div className="submenu ">
                  <Link to="/">
                    <Button>For Man</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>For Women</Button>{' '}
                  </Link>
                  <Link to="/">
                    <Button>For Child</Button>{' '}
                  </Link>
                </div>
              </li>
              <li>
                <Link to="/">
                  <Button>
                    <CgGym />
                    Wellness
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-sm-10 navCartPart2 d-flex align-items-center">
        <ul className="list list-inline d-flex w-100 ml-auto mr-auto">
          <li className="list-inline-item">
            <Link to="/">
              <FaHome /> Home
            </Link>
          </li>
          <li className="list-inline-item">
            <Link to="/cat/:id">
              <FaTshirt />
              Fashion
            </Link>
            <div className="submenu shadow">
              <Link to="/">
                <Button>men</Button>{' '}
              </Link>
              <Link to="/">
                <Button>women</Button>{' '}
              </Link>
              <Link to="/">
                <Button>others</Button>{' '}
              </Link>
            </div>
          </li>
          <li className="list-inline-item">
            <Link to="/cat/:id">
              <MdElectricBolt />
              Electronics
            </Link>
            <div className="submenu shadow">
              <Link to="/">
                <Button>Laptops</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Smart Watch</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Cameras</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Accessories</Button>{' '}
              </Link>
            </div>
          </li>
          <li className="list-inline-item">
            <Link to="/">
              <BsBagHeart />
              Bags
            </Link>
            <div className="submenu shadow">
              <Link to="/">
                <Button>Men Bags</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Women Bags</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Child Bags</Button>{' '}
              </Link>
            </div>
          </li>
          <li className="list-inline-item">
            <Link to="/">
              <GiWingfoot />
              FootWear
            </Link>
            <div className="submenu shadow">
              <Link to="/">
                <Button>Men FootWears</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Women FootWears</Button>{' '}
              </Link>
              <Link to="/">
                <Button>Child FootWears</Button>{' '}
              </Link>
            </div>
          </li>
          <li className="list-inline-item">
            <Link to="/">
              <CiShop />
              Groceries
            </Link>
          </li>
          <li className="list-inline-item">
            <Link to="/">
              <CiFaceSmile />
              Beauty
            </Link>
            <div className="submenu shadow">
              <Link to="/">
                <Button>For Man</Button>{' '}
              </Link>
              <Link to="/">
                <Button>For Women</Button>{' '}
              </Link>
              <Link to="/">
                <Button>For Child</Button>{' '}
              </Link>
            </div>
          </li>
          <li className="list-inline-item">
            <Link to="/">
              <CgGym />
              Wellness
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
