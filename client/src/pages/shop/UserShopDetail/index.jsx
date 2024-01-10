import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetchShopProductsQuery } from '../../../redux/api/ProductApi';
import ProductCard from '../../../components/user/ProductCard';
import {
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
  Rating,
  Alert,
} from '@mui/material';

const Index = () => {
  const location = useLocation();
  const { shop } = location.state;
  const {
    data,
    error: fetchProductsError,
    isLoading: fetchProductsLoading,
  } = useFetchShopProductsQuery(shop);

  console.log(data)

  return (
    <>
      <Container sx={{ marginTop: '72px' }}>
        <Typography typography={'title'}>abc</Typography>
        <Typography typography={'text'}>Welcome to Wat phnomasd</Typography>
        <Typography typography={'section'} sx={{ marginTop: '32px', marginBottom: '16px' }}>
          Products From Shop
        </Typography>
        {fetchProductsLoading ? (
          ''
        ) : (
          <Grid container spacing={1.2}>
            {data?.data.products.map((product) => (
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
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Index;
