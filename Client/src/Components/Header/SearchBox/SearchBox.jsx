import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Button from '@mui/material/Button';
import './SearchBox.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeyword(params.get('search') || '');
  }, [location.search]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();
    const params = new URLSearchParams(location.search);

    if (trimmedKeyword) {
      params.set('search', trimmedKeyword);
    } else {
      params.delete('search');
    }

    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <form className="headerSearch mr-3" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for products..."
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <Button type="submit">
        <FaSearch />
      </Button>
    </form>
  );
};

export default SearchBox;
