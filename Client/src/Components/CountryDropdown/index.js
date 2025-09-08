import React, { useContext, useEffect, useState } from "react";
import "./index.scss";
import Button from "@mui/material/Button";
import { FaAngleDown } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
import { FaSearch } from "react-icons/fa";
import "../Header/SearchBox/SearchBox.scss";
import { IoCloseOutline } from "react-icons/io5";
import { MyContext } from "../../App";

const CountryDropdown = () => {
  const context = useContext(MyContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryList, setCountryList] = useState([]);
  // console.log(context.countryList[selectedTab].country);
  const handleClickDialog = () => {
    setIsOpenModal(!isOpenModal);
  };
  const handleCloseDialog = () => {
    setIsOpenModal(false);
    setCountryList(context.countryList);
  };
  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpenModal(false);
    setCountryList(context.countryList);
  };

  useEffect(() => {
    setCountryList(context.countryList);
  }, [context.countryList]);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword !== "") {
      const list = countryList.filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });

      setCountryList(list);
    } else {
      setCountryList(context.countryList);
    }
  };
  return (
    <>
      <Button className="countryDrop" onClick={handleClickDialog}>
        <div className="info d-flex flex-column">
          <span className="label">Your Location</span>
          <span className="name">
            {selectedCountry?.country
              ? selectedCountry.country.length > 10
                ? selectedCountry.country.substring(0, 10) + "..."
                : selectedCountry.country
              : "All Country"}
          </span>
        </div>
        <span className="icon ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog open={isOpenModal} className="locationModal">
        <h4>Choose your Delivery Location</h4>
        <p>Enter your address and we will specify the offer for your area.</p>
        <button className="close_" onClick={handleCloseDialog}>
          <IoCloseOutline />
        </button>
        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="Search your area..."
            onChange={filterList}
          />
          <Button>
            <FaSearch />
          </Button>
        </div>

        <ul className="countryList">
          {countryList.length !== 0 &&
            countryList?.map((item, index) => {
              // console.log(item.country);
              return (
                <li key={index}>
                  <Button
                    onClick={() => selectCountry(item)}
                    className={
                      selectedCountry?.country === item.country ? "active" : ""
                    }
                  >
                    {item.country}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
