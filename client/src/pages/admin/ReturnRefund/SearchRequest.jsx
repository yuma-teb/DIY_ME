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
import { useFetchRefundReturnByIdQuery } from '../../../redux/store';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const SearchOrder = () => {
  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const SearchResults = ({ searchVal }) => {
    const {
      data: searchRefundReturnData,
      error: refundReturnError,
      isLoading: refundReturnLoading,
    } = useFetchRefundReturnByIdQuery(searchVal);
    // console.log(searchRefundReturnData);
    const searchedReq = searchRefundReturnData?.data?.data;
    // console.log(searchedReq);
    if (refundReturnLoading) {
      return <div>Loading...</div>;
    }
    if (refundReturnError) {
      return <div>Error: {refundReturnError.message}</div>;
    }
    if (!searchedReq && showSearchResults) {
      return <div>Request with ID {searchVal} not found</div>;
    }
    return (
      <List className="search-dropdown" sx={{ position: 'absolute', zIndex: 3, width: '31%' }}>
        <ListItem disablePadding>
          <Link to={`/admin/returnrefund/${searchedReq._id}`}>
            <ListItemButton>
              <ListItemText
                primary={`Refund ID: ${searchedReq?._id}` || 'Product name not available'}
                secondary="See more detail"
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

export default SearchOrder;
