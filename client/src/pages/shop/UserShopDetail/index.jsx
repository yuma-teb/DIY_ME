import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetchShopByIdQuery } from '../../../redux/api/ShopApi';
import ProductCard from '../../../components/user/ProductCard';
import { Container, Typography, Grid, Alert } from '@mui/material';

const Index = () => {
  const location = useLocation();
  const { shop } = location.state;

  const {
    data: dataShop,
    error: fetchShopError,
    isLoading: fetchShopLoading,
  } = useFetchShopByIdQuery(shop);
  const name = dataShop?.data?.shop?.name;
  const description = dataShop?.data?.shop?.description;
  const cover = dataShop?.data?.shop?.imageCoverLink;

  if (fetchShopLoading) {
    return <div>Loading shop...</div>;
  }

  if (fetchShopError) {
    return <Alert severity="error">Error loading shop!</Alert>;
  }

  return (
    <>
      <Container sx={{ marginTop: '72px' }}>
        <Typography typography={'title'}>{name}</Typography>
        <Typography typography={'text'}>{description}</Typography>
        {cover ? (
            <img src={cover} alt="" style={{width: '100%', height: '200px', objectFit: 'cover'}}/>
        ) : (
          <div>Image not available</div>
        )}
        <Typography typography={'section'} sx={{ marginTop: '32px', marginBottom: '16px' }}>
          Products From Shop
        </Typography>
        {fetchShopLoading ? (
          ''
        ) : (
          <Grid container spacing={1.2}>
            {dataShop?.data?.shop?.products.map((product) => (
              <Grid item xs={6} key={product._id}>
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
