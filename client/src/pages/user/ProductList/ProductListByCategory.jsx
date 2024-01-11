import React, { useEffect, Suspense } from 'react';
import axios from 'axios';

// component import
import { Grid } from '@mui/material';
import ProductCard from '../../../components/user/ProductCard';
import { useInfiniteQuery } from 'react-query';

const ProductListByCategory = ({ categoryId, sorted }) => {
  const fetchProducts = async (page = 1) => {
    const response = await axios.get(
      `http://54.169.120.80/api/v1/product?page=${page}&limit=8&category=${categoryId}&sort=${sorted}`,
    );
    return response;
  };
  const { data, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(
    'products',
    ({ pageParam = 1 }) => fetchProducts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = lastPage.data.all_products / 8 + 1;
        const nextPage = allPages.length + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    },
  );

  useEffect(() => {
    refetch();
    let fetching = false;
    const onScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } = event.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
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
  }, [categoryId, sorted]);

  return (
    <>
      <Grid container spacing={1.2}>
        {data.pages.map((page) =>
          page?.data?.data?.products.map((product) => (
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
    </>
  );
};

export default ProductListByCategory;
