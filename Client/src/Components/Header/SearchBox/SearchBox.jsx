import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Button from '@mui/material/Button';
import './SearchBox.scss';
const SearchBox = () => {
  return (
    <div className="headerSearch mr-3 ">
      <input type="text" placeholder="Search for products..." />
      <Button>
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchBox;
