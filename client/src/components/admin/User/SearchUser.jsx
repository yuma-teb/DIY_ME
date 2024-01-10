import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchUserQuery } from '../../../redux/store';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const SearchUser = () => {
  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // const [searchVal, setSearchVal] = useState(
  //   localStorage.getItem('searchValue') ? localStorage.getItem('searchValue') : '',
  // );

  const SearchResults = ({ searchVal }) => {
    const {
      data: searchedUserData,
      error: searchedUserError,
      isLoading: searchedUserLoading,
    } = useFetchUserQuery(searchVal);
    console.log(searchedUserData?.data?.doc);
    const searchedUsers = searchedUserData?.data?.doc;
    console.log(searchedUsers);
    if (searchedUserLoading) {
      return <div>Loading...</div>;
    }

    if (searchedUserError) {
      return <div>Error loading user!</div>;
    }
    if (!searchedUsers && showSearchResults) {
      return <div>User {searchVal} not found</div>;
    }

    return (
      <List className="search-dropdown" sx={{ position: 'absolute', zIndex: 3, width: '39%' }}>
        {searchedUsers.slice(0, 5).map((user) => (
          <ListItem key={user._id} disablePadding>
            <Link to={`/admin/users/${user._id}`}>
              <ListItemButton>
                <ListItemText primary={user.username} secondary={user.email} />
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
    // localStorage.setItem('searchValue', searchVal);
    setShowSearchResults(true);
  };
  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchVal('');
    // localStorage.setItem('searchValue', searchVal);
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

export default SearchUser;
