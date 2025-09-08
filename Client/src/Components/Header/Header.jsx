import React, { useContext } from 'react';
import './Header.scss';
import { useLocation, useNavigate } from 'react-router-dom';
// import Logo from "../../assets/images/Logo.png";

import Logo from '../../assets/images/Logo/Logo_ntp_store.jpg';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { IoBagOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import { LuUserRoundPen } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion';

import CountryDropdown from '../CountryDropdown';
import Button from '@mui/material/Button';
import SearchBox from './SearchBox/SearchBox';
import Navigation from './Navigation/Navigation';
import { MyContext } from '../../App';
import { height } from '@mui/system';

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavRoutes = ['/signIn', '/register', '/forgotPassword'];

  return (
    <div className="headerWrapper">
      <div className="top-strip bg-purple">
        <div className="container">
          <p className="mb-0 mt-0 text-center">
            Your <b>satisfaction </b> is our <b>happiness</b>!
          </p>
        </div>
      </div>

      <div className="header">
        <div className="container">
          <div className="row">
            <div
              className="logoWrapper col-sm-2"
              onClick={() => {
                navigate('/');
              }}
            >
              <img src={Logo} alt="" />
            </div>

            <div className="col-sm-10 d-flex align-items-center part2">
              {/* {context.countryList.length !== 0 && <CountryDropdown />} */}
              <SearchBox />

              <div className="part3 d-flex align-items-center ml-auto">
                <Button
                  className="circle mr-3 "
                  onClick={() => {
                    const token = sessionStorage.getItem('accessToken');
                    if (token) {
                      navigate('/profile');
                    } else {
                      navigate('/signIn');
                    }
                  }}
                >
                  {sessionStorage.getItem('accessToken') ? (
                    <LuUserRoundPen />
                  ) : (
                    <FaRegUser />
                  )}
                </Button>
                <div className="ml-auto cartTab d-flex align-items-center ">
                  <span className="price">$143.97</span>
                  <div className="position-relative ml-2">
                    <Button
                      className=" ml-2"
                      onClick={() => {
                        navigate('/cart/');
                      }}
                    >
                      <IoBagOutline />
                    </Button>

                    <span className="count d-flex align-items-center justify-content-center">
                      4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!hideNavRoutes.includes(location.pathname) && (
          <motion.div
            className="header"
            style={{ height: '70px', padding: '3px 0' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container">
              <Navigation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
