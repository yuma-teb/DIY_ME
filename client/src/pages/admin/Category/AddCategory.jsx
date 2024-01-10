import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAddCategoryMutation } from '../../../redux/store';
import '../Products/Product.css';

import { Typography, Button, Paper, TextField, Container } from '@mui/material';

const AddCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: '',
    image: '',
  });

  const [addCategoryMutation, { isLoading: addCategoryLoading, isError: addCategoryError }] =
    useAddCategoryMutation();

  const isCategoryValid = () => {
    return category.name.trim() !== '' && category.description.trim() !== '';
  };

  const handleAddCategory = async (e) => {
    if (isCategoryValid()) {
      e.preventDefault();
      console.log(category.image);
      const formDataWithImages = new FormData();
      console.log(formDataWithImages);
      Object.entries(category).forEach(([key, value]) => {
        if (key !== 'image') {
          formDataWithImages.append(key, value);
        } else {
          formDataWithImages.append('image', category.image);
        }
      });

      await addCategoryMutation(formDataWithImages);
      navigate('/admin/products/categories');
    } else {
      alert('Please fill in all category fields before adding.');
    }
  };

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files[0] : e.target.value;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  return (
    <>
      <Container>
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography variant="h1">Add Category</Typography>
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
              value={category.name}
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
              value={category.description}
              onChange={handleChange}
            />
          </div>
          <div className="space-content">
            <Button variant="contained" component="label">
              Upload image
              <input type="file" name="image" hidden onChange={handleChange} />
            </Button>
          </div>
          <div className="Image-upload">
            {category.image && (
              <img src={URL.createObjectURL(category.image)} alt="Preview" className="height-200" />
            )}
            {!category.image && <Typography variant="h3">Image upload will be here</Typography>}
          </div>
        </Paper>
        <div className="d-flex flex-end itemcenter header-space">
          <div className="d-flex j-spacebtw itemcenter btn-product">
            <Link to="/admin/products/categories">
              <Button variant="outlined" color="nonAction">
                discard
              </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
              save category
            </Button>
            {addCategoryLoading && <div>Adding category...</div>}
            {addCategoryError && <div>Error adding category!</div>}
          </div>
        </div>
      </Container>
    </>
  );
};

export default AddCategory;
