import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useFetchProductByNameQuery } from '../../../redux/store';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const SearchProduct = () => {
  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const SearchResults = ({ searchVal }) => {
    const {
      data: searchProductData,
      error: productError,
      isLoading: productLoading,
    } = useFetchProductByNameQuery(searchVal);
    const searchedProducts = searchProductData?.data?.doc;
    console.log(searchedProducts);
    if (productLoading) {
      return <div>Loading...</div>;
    }
    if (productError) {
      return <div>Error: {productError.message}</div>;
    }
    if (!searchedProducts && showSearchResults) {
      return <div>Product {searchVal} not found</div>;
    }
    return (
      <List className="search-dropdown" sx={{ position: 'absolute', zIndex: 3, width: '39%' }}>
        {searchedProducts.slice(0, 5).map((product) => (
          <ListItem key={product._id} disablePadding>
            <Link to={`/admin/products/${product._id}`}>
              <ListItemButton>
                <ListItemText primary={product.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    );
  };
  const handleSearchInputChange = (e) => {
    setSearchVal(e.target.value);
    setIsSearching(true);
  };
  const handleClickSearch = async () => {
    console.log('Clicked search', searchVal);
    setShowSearchResults(true);
  };
  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchVal('');
    setIsSearching(false);
  };
  return (
    <div>
      <TextField
        id="search"
        type="search"
        label="Search"
        value={searchVal}
        onChange={handleSearchInputChange}
        sx={{ width: '50%', marginTop: '10px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isSearching && (
                <IconButton onClick={handleCloseSearch}>
                  <CloseIcon />
                </IconButton>
              )}
              <IconButton onClick={handleClickSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showSearchResults && <SearchResults searchVal={searchVal} />}
    </div>
  );
};

export default SearchProduct;
