import React, { useState, useEffect } from 'react';
import './product.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddVariation from './AddVariation';
import { useSelector, useDispatch } from 'react-redux';
import { setVariations } from '../../../redux/slices/VariationSlice';
import {
  useFetchAllCategoriesQuery,
  useFetchProductByIdQuery,
  useEditProductByIdMutation,
} from '../../../redux/store';

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
  Alert,
} from '@mui/material';

const paperWithQuill = {
  height: '470px',
};

const EditProduct = () => {
  const { id } = useParams();
  const {
    data: dataProduct,
    error: fetchProductError,
    isLoading: fetchProductLoading,
  } = useFetchProductByIdQuery(id);
  const {
    data: dataCategory,
    error: fetchCategoriesError,
    isLoading: fetchCategoriesLoading,
  } = useFetchAllCategoriesQuery();
  console.log('###Cat####', dataCategory);
  const [editProduct, { isLoading: editProductLoading, isError: editProductError }] =
    useEditProductByIdMutation();

  const resImage = dataProduct?.data?.img || [];
  console.log('DATA %%%%', dataProduct?.data?.imagesLink);
  const dispatch = useDispatch();
  const addVariationCard = useSelector((state) => state.variation.addVariationCard);
  console.log('First', addVariationCard);

  // handle edit product
  const navigate = useNavigate();
  console.log(addVariationCard);
  const [product, setProduct] = useState({
    name: '',
    productSummary: '',
    category: '',
    description: '',
    tutorial: '',
    isActive: true,
    variations: [],
    newImage: [],
    oldImage: [],
  });

  // handle category
  const categories = dataCategory?.data?.docs || [];

  useEffect(() => {
    const resProduct = dataProduct?.data?.product || {};

    dispatch(setVariations(dataProduct?.data?.product?.variations));
    setProduct((prevProduct) => ({
      ...prevProduct,
      name: resProduct?.name || '',
      productSummary: resProduct?.productSummary || '',
      category: resProduct?.category || {},
      description: resProduct?.description || '',
      variations: addVariationCard || [],
      tutorial: resProduct?.tutorial || '',
      isActive: resProduct?.isActive || false,
      newImage: [],
      oldImage: resProduct?.images ?? [],
    }));

    setCategory(resProduct?.category?._id);
  }, [dataProduct]);
  const [category, setCategory] = useState(dataProduct?.data?.product.category._id);

  const handleChangeSelectCategory = (event) => {
    setCategory(event.target.value);
    console.log('Cato', category);
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: event.target.value,
    }));
    console.log('ID', product.category);
  };

  // handle change input
  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files : e.target.value;

    if (type === 'file') {
      console.log('Added new files:', value);
      setProduct((prevProduct) => ({
        ...prevProduct,
        newImage: [...prevProduct.newImage, ...value],
      }));
      console.log('All', product.newImage);
    } else {
      console.log('Non-file value:', value);
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleQuillChange = (content, name) => {
    setProduct((prevProduct) => ({ ...prevProduct, [name]: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProduct((prevProduct) => ({ ...prevProduct, variations: addVariationCard }));

    const formDataWithImages = new FormData();
    if (product.newImage) {
      product.newImage.forEach((file) => {
        console.log(file);
        formDataWithImages.append('image', file);
      });
    } else {
      console.log('Herryryryry');
      return;
    }

    addVariationCard.forEach((file) => {
      formDataWithImages.append('variations', JSON.stringify(file));
    });

    formDataWithImages.append('name', product.name);
    formDataWithImages.append('productSummary', product.productSummary);
    formDataWithImages.append('category', category);
    formDataWithImages.append('description', product.description);
    formDataWithImages.append('tutorial', product.tutorial);
    formDataWithImages.append('variations', JSON.stringify(addVariationCard));
    formDataWithImages.append('id', id);

    let res = null;
    if (formDataWithImages) {
      res = await editProduct(formDataWithImages);
      console.log('REss', res);
    }

    if (formDataWithImages.get('id') === id) {
      navigate('/shop/product');
    }

    // window.location.reload();
  };

  if (fetchProductLoading) {
    return <div>Loading product data...</div>;
  }
  if (fetchProductError) {
    return <Alert severity="error">Error loading product data!</Alert>;
  }

  return (
    <>
      <Container sx={{marginTop: '32px'}}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="d-flex j-spacebtw itemcenter header-space">
            <Typography typography="h1">Edit Product</Typography>
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
                  {resImage.map((img, index) => (
                    <img key={index} src={img} alt="Preview" className="height-350 image-space" />
                  ))}
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
                      label="Category"
                      value={!category ? dataProduct?.data?.product.category._id : category}
                      onChange={handleChangeSelectCategory}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
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
              {editProductLoading && <div>Editting product...</div>}
              {editProductError && <div>Error editting product!</div>}
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditProduct;
