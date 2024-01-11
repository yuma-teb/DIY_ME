import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useFetchProductByNameQuery } from '../../../redux/store';
import ProductCard from '../../../components/user/ProductCard';
import { useInfiniteQuery } from 'react-query';
import { Grid, TextField, InputAdornment, IconButton, Container } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const UserSearchProduct = () => {
  const [searchVal, setSearchVal] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const SearchResults = ({ searchVal }) => {
    const fetchProducts = async (page = 1) => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/product/search/${searchVal}?page=${page}&limit=8`,
      );
      return response;
    };
    const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
      'products',
      ({ pageParam = 1 }) => fetchProducts(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = (lastPage.data.allSearchedProducts / 8) + 1;
          const nextPage = allPages.length + 1;
          if (nextPage <= maxPages && lastPage.data.nextPage) {
            return nextPage;
          }
          console.log("LOVE YOU");
          return undefined;
        },
      },
    );

    useEffect(() => {
      let fetching = false;
      // const onScroll = async (event) => {
      //   const { scrollHeight, scrollTop, clientHeight } = event.target.scrollingElement;
      //   if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
      //     fetching = true;
      //     if (hasNextPage) await fetchNextPage();
      //     fetching = false;
      //   }
      // };

      const onScroll = async (event) => {
        console.log("JAJA", event.target.scrollingElement);
        const { scrollHeight, scrollTop, clientHeight } = event.target.scrollingElement;

        // Check if there's more data to fetch and not already fetching
        if (hasNextPage && !fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
          fetching = true;

          // Use React.startTransition if needed
          React.startTransition(async () => {
            console.log(object);
            await fetchNextPage();
            fetching = false;
          });
        }
      };

      const wrappedOnScroll = (event) => {
        React.startTransition(() => {
          onScroll(event);
        });
      };
      document.addEventListener('scroll', wrappedOnScroll);
      return () => {
        document.removeEventListener('scroll', wrappedOnScroll);
      };
    }, [searchVal, fetchProducts]);

    console.log(data);

    return (
      <Grid container spacing={1.2} sx={{ marginTop: '16px', marginBottom: '16px' }}>
        {data.pages.map((page) =>
          page?.data?.data?.doc.map((product) => (
            <Suspense key={product._id} fallback={null}>
              <Grid item xs={6}>
                <ProductCard
                  productId={product._id}
                  img={product.imagesLink[0]}
                  price={product.price}
                  name={product.name}
                  rating={product.ratingAverage}
                  sold={product.sold}
                />
              </Grid>
            </Suspense>
          )),
        )}
      </Grid>
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
    <>
      <Container>
        <TextField
          autoFocus
          id="search"
          type="search"
          label="Search"
          value={searchVal}
          onChange={handleSearchInputChange}
          sx={{ width: '100%', marginTop: '72px' }}
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
      </Container>
    </>
  );
};

export default UserSearchProduct;
