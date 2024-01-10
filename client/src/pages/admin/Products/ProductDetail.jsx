import React from 'react';
import './Product.css';
import { useFetchProductByIdQuery } from '../../../redux/store';
import { useParams } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

const variationCardStyle = {
  margin: '8px 0',
};

const ProductDetail = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      centerMode: true,
    },
  };
  const { id } = useParams();

  const {
    data,
    error: fetchProductError,
    isLoading: fetchProductLoading,
  } = useFetchProductByIdQuery(id);

  if (fetchProductLoading) {
    return <div>Loading product details...</div>;
  }

  console.log('SHOP DATA', data);
  if (fetchProductError) {
    return <Alert severity="error">Error loading product details!</Alert>;
  }
  const resImage = data?.data?.img || [];
  const resProduct = data?.data?.product || [];
  console.log(resProduct);
  const totalStock = (resProduct.variations || []).reduce(
    (total, variation) => total + variation.stock,
    0,
  );
  const lowestPrice = (resProduct.variations || []).reduce((minPrice, variation) => {
    return variation.price < minPrice ? variation.price : minPrice;
  }, Number.MAX_SAFE_INTEGER);

  function VariationCard({ index, name, attribute, stock, price }) {
    return (
      <Card className="variation-card">
        <CardContent>
          <div className="d-flex flex-col">
            <Typography typography="h2">Variation {index + 1} </Typography>
            <Typography typography="body1" style={variationCardStyle}>
              <span className="nonAction-color">Title : </span>
              {name}
            </Typography>
            <Typography typography="body1" style={variationCardStyle}>
              <span className="nonAction-color">Attribute : </span>
              {attribute}
            </Typography>
            <Typography typography="body1" style={variationCardStyle}>
              <span className="nonAction-color">Price : </span>$ {price}
            </Typography>
            <Typography typography="body1" style={variationCardStyle}>
              <span className="nonAction-color">Stock : </span>
              {stock}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Container sx={{ marginTop: '32px' }}>
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography typography="h1">Product details</Typography>
          <div className="d-flex j-spacebtw itemcenter btn-product">
            <Link to={`/shop/product/${resProduct._id}/edit`}>
              <Button variant="contained" color="primary" type="submit">
                Edit Product
              </Button>
            </Link>
          </div>
        </div>
        <Paper className="paper-layout">
          <Typography typography="h2">General information</Typography>

          <div className="d-flex space-grid">
            <Carousel responsive={responsive} className="space-content width-50">
              {resImage.map((image, index) => (
                <div key={index} className="carousel-item">
                  <img key={index} src={image} alt={resProduct.name} className="height-350" />
                </div>
              ))}
            </Carousel>

            <div className="width-50 paper-layout">
              <Typography typography="h1" className="space-content">
                {resProduct.name}
              </Typography>

              <Typography typography="body1">
                <span className="nonAction-color">Rating :</span> {resProduct.ratingAverage} (
                {resProduct.ratingQuantity})
              </Typography>
              <Typography typography="h1" sx={{ margin: '16px 0', color: 'red' }}>
                <span>$ {lowestPrice}</span>
              </Typography>
              <Typography typography="body1">
                <span>{resProduct.productSummary}</span>
              </Typography>
              <div className="space-content d-flex">
                <div className="width-50">
                  <Typography typography="body1">
                    <span className="nonAction-color">Stock : </span>
                    {totalStock}
                  </Typography>
                </div>
                <Typography typography="body1">
                  <span className="nonAction-color">Sold : </span>
                  {resProduct.sold}
                </Typography>
              </div>
              <div className="space-content">
                <Typography typography="body1">
                  <span className="nonAction-color">Shop : </span>
                  {resProduct.shop.name}
                </Typography>
              </div>
              <Typography typography="body1">
                <span className="nonAction-color">Category : </span>
                {resProduct.category && resProduct.category.name}
              </Typography>
              <div className="space-content">
                <Typography typography="body1">
                  <span className="nonAction-color">Status : </span>
                  {resProduct.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </div>
            </div>
          </div>
          <Grid container className="product-name-input">
            {Array.isArray(resProduct.variations) &&
              resProduct.variations.map((data, index) => (
                <VariationCard key={index} index={index} {...data} />
              ))}
          </Grid>
          <div className="d-flex space-grid space-content">
            <Typography>
              <span className="nonAction-color">Description: </span>
            </Typography>
            <Typography component="div">
              <div dangerouslySetInnerHTML={{ __html: resProduct.description }} />
            </Typography>
          </div>
          <div className="d-flex space-grid space-content">
            <Typography>
              <span className="nonAction-color">Tutorial: </span>
            </Typography>
            <Typography component="div">
              <div dangerouslySetInnerHTML={{ __html: resProduct.tutorial }} />
            </Typography>
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default ProductDetail;
