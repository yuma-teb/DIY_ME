import React from 'react';
import { useFetchCategoryByIdQuery } from '../../../redux/store';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Button, Paper, TextField } from '@mui/material';

const CategoryDetail = () => {
  const { id } = useParams();
  const {
    data: allCategoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useFetchCategoryByIdQuery(id);
  const resCategory = allCategoriesData?.data?.doc || [];

  return (
    <>
      <Container>
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography variant="h1">Add Category</Typography>
          <div className="d-flex j-spacebtw itemcenter btn-product">
            <Link to={`/admin/products/categories/${resCategory._id}/edit`}>
              <Button variant="contained" color="primary">
                Edit category
              </Button>
            </Link>
          </div>
        </div>
        <Paper className="paper-layout space-content ">
          <Typography typography="h2">General information</Typography>
          <div className="d-flex space-content">
            <div className="width-50 d-flex j-center">
              <img src={resCategory.imageLink} alt={resCategory.name} className="height-350" />
            </div>
            <div className="width-50">
              <Typography typography="h1" className="space-content">
                {resCategory.name}
              </Typography>
              <Typography typography="body1">
                <span className="nonAction-color">Description : </span>
                {resCategory.description}
              </Typography>
            </div>
          </div>
        </Paper>
      </Container>
    </>
  );
};

export default CategoryDetail;
