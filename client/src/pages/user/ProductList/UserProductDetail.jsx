import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';

//import hook API
import { useFetchProductByIdQuery } from '../../../redux/store';
import { useFetchCategoryByIdQuery } from '../../../redux/store';
import { useFetchAllProductReviewsQuery } from '../../../redux/store';

// import component
import './product.css';
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
import Carousel from 'better-react-carousel';
import { openOverlay } from '../../../redux/slices/VariationOverlaySlice';
import ProductReview from '../../../components/user/ProductReviewCard';

// import icon
import ProductCard from '../../../components/user/ProductCard';
import VariationOverlay from './VariationOverlay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState('');
  const [productImg, setProductImg] = useState([]);
  const [productReview, setProductReview] = useState([]);
  const [productReviewImg, setProductReviewImg] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [variation, setVariation] = useState([]);

  // fetching product by id
  const {
    data: dataProduct,
    error: fetchProductError,
    isLoading: fetchProductLoading,
  } = useFetchProductByIdQuery(id);
  const resProduct = dataProduct?.data?.product || {};
  const reviewAvg = parseFloat(resProduct.ratingAverage).toFixed(1);

  const {
    data: dataProductReview,
    error: fetchProductReviewError,
    isLoading: fetchProductReviewLoading,
  } = useFetchAllProductReviewsQuery(resProduct._id);
  // use useEffect to set the category id and product image
  useEffect(() => {
    if (dataProduct && dataProductReview && !fetchProductLoading) {
      const resCategory = dataProduct?.data?.product?.category?.id || '';
      const resImage = dataProduct?.data?.img || [];
      const resProductReview = dataProductReview?.data?.reviews;
      const resImageReview = dataProductReview?.data?.img;
      setCategoryId(resCategory);
      setProductImg(resImage);
      setProductReview(resProductReview);
      setProductReviewImg(resImageReview);
      setFetchData(true);
      const variationLength = resProduct.variations;
      setVariation(variationLength);
    }
  }, [dataProduct, dataProductReview]);

  // fetching product data by category
  const {
    data: dataCategory,
    error: fetchCategoryError,
    isLoading: fetchCategoryLoading,
  } = useFetchCategoryByIdQuery(dataProduct?.data?.product?.category?.id ? categoryId : '');
  const resProductFromCategory = dataCategory?.data?.doc?.products || [];

  // handle open variation overlay
  const overlay = useSelector((status) => status.variationOverlay.initOverlay);
  const handleClickOverlay = () => {
    dispatch(openOverlay());
  };

  // handle to shop detail
  const handleToShop = () => {
    navigate(`/products/${resProduct._id}/shop`, { state: { shop: resProduct?.shop?._id } });
  };

  // handle to shop detail
  const handleToReview = () => {
    navigate(`/products/${resProduct._id}/review`, { state: { product: resProduct._id } });
  };

  // RTK error handling
  if (fetchProductLoading) {
    return <div>Loading product details...</div>;
  }

  if (fetchProductError) {
    return <Alert severity="error">Error loading product details!</Alert>;
  }

  if (fetchCategoryLoading) {
    return <div>Loading category details...</div>;
  }

  if (fetchCategoryError) {
    return <Alert severity="error">Error loading category details!</Alert>;
  }

  // mui function style
  const marginButtom = {
    marginBottom: '8px',
  };

  const sectionPadding = {
    padding: '8px 0',
  };
console.log("PRODUCT",resProductFromCategory );
  return (
    <>
      <div className="carousel-img">
        <Carousel>
          {productImg.map((img) => (
            <Carousel.Item>
              <img className="carousel-item" src={img} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <Paper style={marginButtom}>
        <Container>
          <Typography typography={'title'} sx={{ color: '#F6555F', padding: '16px 0 4px 0' }}>
            $ {resProduct.price}
          </Typography>
          <Typography typography={'section'}>{resProduct.name}</Typography>
          <Typography typography={'text'} sx={{ color: '#808080', margin: '4px 0' }}>
            {resProduct.productSummary}
          </Typography>
          <div className="d-flex j-spacebtw">
            <div className="d-flex">
              <Rating
                name="read-only"
                value={reviewAvg}
                precision={0.5}
                readOnly
                size="small"
                className="selfcenter"
              />
              <Typography typography={'text'} sx={{ color: '#808080', margin: '4px' }}>
                {reviewAvg} ({resProduct.ratingQuantity})
              </Typography>
            </div>
            <Typography typography={'text'} sx={{ color: '#808080' }} className="selfcenter">
              {resProduct.sold} Sold
            </Typography>
          </div>
        </Container>
      </Paper>
      <Paper style={marginButtom}>
        <Container>
          <Typography typography={'section'} style={sectionPadding}>
            Variations
          </Typography>
          {variation.length > 2 ? (
            <div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="variation-img-list" onClick={handleClickOverlay}>
                    <div className="variation-img">{variation[0].name}</div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="variation-img-list" onClick={handleClickOverlay}>
                    <div className="variation-img">{variation[1].name}</div>
                  </div>
                </Grid>
              </Grid>
              <div className="d-flex button-variation" onClick={handleClickOverlay}>
                <IconButton size="small" style={marginButtom}>
                  More Variations
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <div>
              <Grid container spacing={2}>
                {resProduct.variations.map((variation, index) => (
                  <Grid item xs={6} key={index}>
                    <div className="variation-img-list" onClick={handleClickOverlay}>
                      <div className="variation-img">{variation.name}</div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}

          {/* variation overlay */}
          {overlay && (
            <VariationOverlay
              openOverlayVariation={overlay}
              variations={resProduct.variations}
              productId={id}
            />
          )}
        </Container>
      </Paper>
      <Paper sx={{ margin: '0 0 8px 0', padding: ' 16px 0' }}>
        <Container>
          <Typography typography={'section'}>Description</Typography>
          <Typography
            typography={'text'}
            sx={{ color: '#808080', marginBottom: '8px' }}
            dangerouslySetInnerHTML={{ __html: resProduct.description }}
          />
          <Typography typography={'section'}>Tutorial</Typography>
          <Typography
            typography={'text'}
            sx={{ color: '#808080' }}
            dangerouslySetInnerHTML={{ __html: resProduct.tutorial }}
          />
        </Container>
      </Paper>
      <Paper style={marginButtom}>
        <Container>
          <Typography typography={'section'} style={sectionPadding}>
            Review ({dataProductReview?.result})
          </Typography>
          {productReview && fetchData && (
            <>
              <ProductReview review={productReview[0]} image={productReviewImg[0]} />
              <ProductReview review={productReview[1]} image={productReviewImg[1]} />
            </>
          )}
          <div className="d-flex button-variation">
            <IconButton size="small" style={marginButtom} onClick={handleToReview}>
              More Reviews
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </Container>
      </Paper>
      <Container sx={{ marginBottom: '64px' }}>
        <Typography typography={'section'} style={sectionPadding}>
          Recommended for you
        </Typography>
        <Grid container spacing={1.2}>
          {resProductFromCategory.map((product) => {
            return <>
            { product._id !== id ?
              <ProductCard
              key={product._id}
              img={product.imagesLink[0]}
              price={product.price}
              name={product.name}
              rating={product.ratingAverage}
              sold={product.sold}
              productId={product._id}
            /> : ""
            }
            </>
          })}
        </Grid>
      </Container>
      <div className="d-flex itemcenter j-spacebtw buttom-app-bar">
        <div className="d-flex flex-col j-center">
          <IconButton size="small" sx={{ color: 'black' }} onClick={handleToShop}>
            <StorefrontIcon />
          </IconButton>
          <Typography sx={{ fontSize: '14px' }}>View Shop</Typography>
        </div>
        <Button variant="contained" sx={{ marginRight: '32px' }} onClick={handleClickOverlay}>
          Add To card
        </Button>
      </div>
    </>
  );
};

export default ProductDetail;
