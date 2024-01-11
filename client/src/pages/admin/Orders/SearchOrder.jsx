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
import { useFetchOrderByIdQuery } from '../../../redux/store';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const SearchOrder = () => {
  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const SearchResults = ({ searchVal }) => {
    const {
      data: searchOrderData,
      error: orderError,
      isLoading: orderLoading,
    } = useFetchOrderByIdQuery(searchVal);
    console.log(searchOrderData);
    const searchedOrders = searchOrderData?.data?.doc;
    console.log(searchedOrders);
    if (orderLoading) {
      return <div>Loading...</div>;
    }
    if (orderError) {
      return <div>Error: {orderError.message}</div>;
    }
    if (!searchedOrders && showSearchResults) {
      return <div>Order(s) with ID {searchVal} not found</div>;
    }
    return (
      <List className="search-dropdown" sx={{ position: 'absolute', zIndex: 3, width: '19%' }}>
        <ListItem disablePadding>
          <Link to={`/admin/orders/${searchedOrders._id}`}>
            <ListItemButton>
              <ListItemText
                primary={
                  `${searchedOrders?.orderItems?.cartItems[0]?.variations?.name} and ${
                    searchedOrders?.orderItems.length - 1
                  } more` || 'Product name not available'
                }
                secondary={searchedOrders._id}
              />
            </ListItemButton>
          </Link>
        </ListItem>
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
        label="Search By ID"
        value={searchVal}
        fullWidth
        onChange={handleSearchInputChange}
        sx={{ marginTop: '10px' }}
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

export default SearchOrder;
