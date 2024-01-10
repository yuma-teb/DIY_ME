import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  useFetchAllCategoriesQuery,
  useDeleteCategoryByIdMutation,
} from '../../../redux/api/CategoryApi';
import { Link } from 'react-router-dom';
import SearchBar from '../../../components/admin/SearchBar';
import {
  Container,
  Typography,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';

const Index = () => {
  const {
    data: allCategoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
    refetch,
  } = useFetchAllCategoriesQuery();
  const [deleteById, { error: deleteCategoryError, isLoading: deleteCategoryLoading }] =
    useDeleteCategoryByIdMutation();
  // useEffect(() => {
  //   refetch();
  // });
  const categories = allCategoriesData?.data?.docs || [];

  const columns = [
    { id: 'id', label: 'Table ID' },
    {
      id: 'name',
      label: 'Category Name',
      align: 'right',
    },
    {
      id: 'description',
      label: 'Description',
      align: 'right',
    },
    {
      id: 'objectId',
      label: 'DB Id',
    },
    {
      id: 'isActive',
      label: 'status',
      format: (value) => (value ? 'Active' : 'Inactive'),
    },
    {
      id: 'button',
      label: 'Actions',
    },
  ];

  if (categoriesLoading) {
    console.log('error fetching user data!');
  }
  const createData = (id, name, description, objectId, isActive) => {
    return { id, name, description, objectId, isActive };
  };
  const createDataFromCategory = (category, index) => {
    const { name, description, _id, isActive } = category;
    return createData(index + 1, name, description, _id, isActive);
  };
  const rowsFromCategories = Array.isArray(categories)
    ? categories.map((category, index) => createDataFromCategory(category, index))
    : [];
  const rows = [...rowsFromCategories];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // handle delete
  const [dialog, setDialog] = useState(null);

  const handleOpenDialog = (categoryId) => {
    setDialog(categoryId);
  };

  const handleCloseDialog = () => {
    setDialog(null);
  };

  const handleDelete = async (categoryId) => {
    deleteById(categoryId);
    setDialog(null);
    await refetch();
  };

  if (categoriesLoading) {
    return <div>Loading categories data...</div>;
  }

  if (categoriesError) {
    return <Alert severity="error">Error loading categories!</Alert>;
  }

  return (
    <>
      <Container sx={{marginTop: '32px'}}>
        <div className="d-flex j-spacebtw itemcenter">
          <Typography typography="h1">Category</Typography>
          <Link to="/admin/products/categories/addcategory">
            <Button variant="contained" color="primary">
              Add Category
            </Button>
          </Link>
        </div>
        {/* <SearchBar /> */}
        <div>
          {' '}
          <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '32px' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === 'button' ? (
                                <div>
                                  <Link to={`/admin/products/categories/${row.objectId}`}>
                                    <IconButton>
                                      <ViewIcon color="view" />
                                    </IconButton>
                                  </Link>
                                  <Link to={`/admin/products/categories/${row.objectId}/edit`}>
                                    <IconButton>
                                      <EditIcon color="success" />
                                    </IconButton>
                                  </Link>
                                  <IconButton onClick={() => handleOpenDialog(row.objectId)}>
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                  <Dialog
                                    open={dialog && dialog == row.objectId}
                                    onClose={handleCloseDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                  >
                                    <DialogTitle id="alert-dialog-title">
                                      {'Delete Order'}
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        Do you want to delete this category ({row.name}) ?
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleCloseDialog}>CANCEL</Button>
                                      <Button onClick={() => handleDelete(row.objectId)} autoFocus>
                                        DELETE
                                      </Button>
                                    </DialogActions>
                                    {deleteCategoryLoading && <div>Deleting category...</div>}
                                    {deleteCategoryError && <div>Error deleting category!</div>}
                                  </Dialog>
                                </div>
                              ) : column.format && typeof value === 'number' ? (
                                column.format(value)
                              ) : column.id === 'isActive' && column.format ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </Container>
    </>
  );
};

export default Index;
