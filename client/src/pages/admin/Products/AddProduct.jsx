import React, { useState, useEffect } from 'react';
import './Product.css';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddVariation from './AddVariation';
import { useSelector, useDispatch } from 'react-redux';
import { useAddProductMutation } from '../../../redux/store';
import { clearVariations } from '../../../redux/slices/VariationSlice';
import { useFetchAllCategoriesQuery } from '../../../redux/store';

import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

const paperWithQuill = {
  height: '470px',
};

const AddProductPage = () => {
  // handle category
  const {
    data,
    error: fetchCategoriesError,
    isLoading: fetchCategoriesLoading,
  } = useFetchAllCategoriesQuery();
  const shop = JSON.parse(localStorage.getItem('user')).shop;
  console.log('SHOP ', shop);
  const categories = data?.data?.docs || [];
  const [category, setCategory] = useState(null);
  const handleChangeSelect = (event) => {
    setCategory(event.target.value);
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: event.target.value,
    }));
  };

  // handle create product
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addVariationCard = useSelector((state) => state.variation.addVariationCard);
  const [product, setProduct] = useState({
    name: '',
    productSummary: '',
    category: category,
    description: '',
    tutorial: '',
    image: [],
    variations: addVariationCard ? addVariationCard : [],
  });

  useEffect(() => {
    setProduct((prevProduct) => ({ ...prevProduct, variations: addVariationCard }));
  }, [addVariationCard]);

  // handle change input
  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files : e.target.value;

    if (type === 'file') {
      console.log('Files:', value);
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: [...prevProduct.image, ...value],
      }));
    } else {
      console.log('Non-file value:', value);
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  //handle input quill
  const handleQuillChange = (content, name) => {
    setProduct((prevProduct) => ({ ...prevProduct, [name]: content }));
  };

  const [addProductMutation, { isLoading: addProductLoading, isError: addProductError }] =
    useAddProductMutation();

  const totalStock = (product.variations || []).reduce(
    (total, variation) => total + parseInt(variation.stock, 10),
    0,
  );

  const lowestPrice = (product.variations || []).reduce((minPrice, variation) => {
    return variation.price < minPrice ? variation.price : minPrice;
  }, Number.MAX_SAFE_INTEGER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();
    product.image.forEach((file) => {
      formDataWithImages.append('image', file);
    });

    if (shop !== null) {
      formDataWithImages.append('shop', shop);
    }

    formDataWithImages.append('name', product.name);
    formDataWithImages.append('productSummary', product.productSummary);
    formDataWithImages.append('category', product.category);
    formDataWithImages.append('description', product.description);
    formDataWithImages.append('tutorial', product.tutorial);
    formDataWithImages.append('variations', JSON.stringify(product.variations));
    formDataWithImages.append('price', lowestPrice);
    formDataWithImages.append('stock', totalStock);

    await addProductMutation(formDataWithImages);
    dispatch(clearVariations());
    navigate('/shop/product');
  };

  return (
    <>
      <Container sx={{ marginTop: '32px' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="d-flex j-spacebtw itemcenter header-space">
            <Typography typography="h1">Add Product</Typography>
          </div>
          <Grid container className="space-grid">
            <Grid item xs={9}>
              <Paper className="paper-layout" style={paperWithQuill}>
                <Typography typography="h2">General information</Typography>
                <div className="space-content">
                  <TextField
                    id="outlined-basic"
                    label="Product Name"
                    variant="outlined"
                    className="product-name-input"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-content">
                  <TextField
                    id="outlined-basic"
                    label="Product Summary"
                    variant="outlined"
                    className="product-name-input"
                    name="productSummary"
                    value={product.productSummary}
                    onChange={handleChange}
                  />
                </div>
                <p className="space-content">Description</p>
                <ReactQuill
                  theme="snow"
                  value={product.description}
                  onChange={(content) => handleQuillChange(content, 'description')}
                  className="height-200"
                />
              </Paper>
              <Paper className="paper-layout">
                <Typography typography="h2">Media</Typography>
                <div className="space-content">
                  <Button variant="contained" component="label">
                    Upload image
                    <input type="file" hidden name="image" multiple onChange={handleChange} />
                  </Button>
                </div>
                <div className="Image-upload">
                  {product.image.length > 0
                    ? product.image.map((img, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${index + 1}`}
                          className="height-200"
                        />
                      ))
                    : ''}
                </div>
              </Paper>

              <Paper className="paper-layout">
                <AddVariation />
              </Paper>
              <Paper className="paper-layout" style={paperWithQuill}>
                <Typography typography="h2">Tutorial</Typography>
                <p className="space-content">Tutorial for the product</p>
                <ReactQuill
                  theme="snow"
                  value={product.tutorial}
                  onChange={(content) => handleQuillChange(content, 'tutorial')}
                  className="height-350"
                />
              </Paper>
            </Grid>
            <Grid item xs={2.82}>
              {fetchCategoriesLoading && <div>Loading categories...</div>}
              {fetchCategoriesError && <div>Error loading categories!</div>}
              <Paper className="paper-layout">
                <Typography typography="h2">Category</Typography>
                <div className="space-content">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label="Category"
                      onChange={handleChangeSelect}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <div className="d-flex flex-end itemcenter header-space">
            <div className="d-flex j-spacebtw itemcenter btn-product">
              <Link to="/admin/products">
                <Button variant="outlined" color="nonAction">
                  cancel
                </Button>
              </Link>
              <Button variant="contained" color="view" type="submit">
                Save Product
              </Button>
              {addProductLoading && <div>Adding product...</div>}
              {addProductError && <div>Error adding product!</div>}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddProductPage;
