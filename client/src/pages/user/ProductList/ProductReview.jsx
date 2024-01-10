import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import ProductReviewCard from '../../../components/user/ProductReviewCard';
import { useFetchAllProductReviewsQuery } from '../../../redux/store';

const ProductReview = () => {
  const location = useLocation();
  const { product } = location.state;
  const {
    data: dataProductReview,
    error: fetchProductReviewError,
    isLoading: fetchProductReviewLoading,
  } = useFetchAllProductReviewsQuery(product);
  const resProductReview = dataProductReview?.data?.reviews;
  const resImageReview = dataProductReview?.data?.img;

  if (fetchProductReviewLoading) {
    return <div>Loading product details...</div>;
  }

  if (fetchProductReviewError) {
    return <Alert severity="error">Error loading product details!</Alert>;
  }
  return (
    <>
      <Container sx={{ marginTop: '72px' }}>
        <Typography typography={'subTitile'}>Product Reviews</Typography>
        {resProductReview.flatMap((review, i) => (
          <ProductReviewCard key={i} review={review} image={resImageReview[i]} />
        ))}
      </Container>
    </>
  );
};

export default ProductReview;
