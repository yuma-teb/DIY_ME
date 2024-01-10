import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import React from 'react';

const Search = () => {
  return (
    <div className="search">
      <TextField
        id="search"
        type="search"
        label="Search"
        sx={{ width: '60%', margin: '10px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Search;
