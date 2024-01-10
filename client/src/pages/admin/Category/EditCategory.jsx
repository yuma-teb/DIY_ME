import React, { useState, useEffect } from 'react';
import { useFetchCategoryByIdQuery, useEditCategoryByIdMutation } from '../../../redux/store';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, TextField } from '@mui/material';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data,
    error: fetchCategoryError,
    isLoading: fetchCategoryLoading,
  } = useFetchCategoryByIdQuery(id);
  const [editCategory, { isLoading: editCategoryLoading, isError: editCategoryError }] =
    useEditCategoryByIdMutation();
  console.log(data);
  const resCategory = data?.data?.doc || [];
  const resImg = data?.data?.img || [];

  const [category, setCategory] = useState({
    name: '',
    description: '',
    image: '',
  });
  console.log(category);
  let newImg = '';
  useEffect(() => {
    // Set initial values when data is available
    const resCategory = data?.data?.doc || [];
    setCategory((prevCategory) => ({
      ...prevCategory,
      name: resCategory.name ?? '',
      description: resCategory.description ?? '',
      image: resCategory.image ?? '',
    }));
    newImg = category.image;
  }, [data, newImg]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setCategory((prevCategory) => ({
        ...prevCategory,
        [name]: files[0],
      }));
    } else {
      setCategory((prevCategory) => ({
        ...prevCategory,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('image', category.image);

    try {
      let response = null;
      if (
        formData.get('name') === category.name &&
        formData.get('description') === category.description &&
        formData.get('image') === category.image
      ) {
        response = await editCategory(formData);
        console.log('Data is send');
      }

      console.log('API Response:', response);

      if (response.error) {
        console.error('Error updating category:', response.error);
      } else {
        console.log('Category updated successfully!');
        navigate('/admin/products/categories');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const isImageValid = category.image instanceof File || category.image instanceof Blob;

  if (fetchCategoryLoading) {
    return <div>Loading category data...</div>;
  }

  if (fetchCategoryError) {
    return <Alert severity="error">Error loading category data!</Alert>;
  }

  return (
    <>
      <Container>
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography variant="h1">Edit Category</Typography>
          <div className="d-flex j-spacebtw itemcenter btn-product">
            <Link to="/products/category">
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save Category
              </Button>
            </Link>
            {editCategoryLoading && <div>Editting category...</div>}
            {editCategoryError && <div>Error editting category!</div>}
          </div>
        </div>
        <Paper className="paper-layout space-content">
          <Typography typography="h2">Category Information</Typography>

          <div className="space-content">
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              className="variation-input"
              name="name"
              value={category.name ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-content">
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              className="variation-input"
              name="description"
              value={category.description ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-content">
            <Button variant="contained" component="label">
              Upload image
              <input type="file" name="image" hidden onChange={handleChange} />
            </Button>
          </div>
          <div className="d-flex j-center">
            {newImg ? (
              <div>
                <img
                  src={category.image instanceof File ? URL.createObjectURL(category.image) : ''}
                  alt="Preview"
                  className="height-350"
                />
              </div>
            ) : (
              <div>
                <img src={resCategory.imageLink} alt="Preview" className="height-350" />
              </div>
            )}
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default EditCategory;
