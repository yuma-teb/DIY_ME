import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  productApi,
  useFetchRequestingProductsQuery,
  useDeleteProductByIdMutation,
  useEditRequestByIdMutation,
} from '../../../redux/api/ProductApi';
import { Link } from 'react-router-dom';
import SearchProduct from './SearchProduct';
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
import { Check } from '@mui/icons-material';
import Header from '../../../components/admin/Common/Header';

const ProductReqeusting = () => {
  const {
    data,
    error: fetchProductsError,
    isLoading: fetchProductsLoading,
  } = useFetchRequestingProductsQuery();
  const [deleteById, { error: deleteProductError, isLoading: deleteProductLoading }] =
    useDeleteProductByIdMutation();
  const [editProduct, { isLoading: editProductLoading, isError: editProductError }] =
    useEditRequestByIdMutation();
  const products = data?.data?.products || [];
  const columns = [
    { id: 'id', label: 'Table ID' },
    {
      id: 'name',
      label: 'Product Name',
      align: 'right',
    },
    {
      id: 'price',
      label: 'Price',
      align: 'right',
    },
    {
      id: 'stock',
      label: 'Stock',
      align: 'right',
    },
    {
      id: 'sold',
      label: 'Sold',
      align: 'right',
    },
    {
      id: 'objectId',
      label: 'DB Id',
    },
    {
      id: 'isActive',
      label: 'status',
      format: (value) => (value ? 'Active' : 'Not Active'),
    },
    {
      id: 'button',
      label: 'Actions',
    },
  ];

  const createData = (id, name, price, stock, sold, objectId, isActive) => {
    return { id, name, price, stock, sold, objectId, isActive };
  };
  const createDataFromProduct = (product, index) => {
    const { name, price, stock, sold, _id, isActive } = product;
    return createData(index + 1, name, price, stock, sold, _id, isActive);
  };
  const rowsFromProducts = Array.isArray(products)
    ? products.map((product, index) => createDataFromProduct(product, index))
    : [];
  const rows = [...rowsFromProducts];

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

  const handleOpenDialog = (productId) => {
    setDialog(productId);
  };

  const handleCloseDialog = () => {
    setDialog(null);
  };

  const handleDelete = (productId) => {
    deleteById(productId);
    setDialog(null);
    window.location.reload();
  };

  const handleAgree = async (id) => {
    try {
      // Use the editProduct mutation and capture the result
      const res = await editProduct({
        id: id,
        isActive: true,
      });

      // Check if the mutation was successful
      if (res.data) {
        // Trigger a refetch of the requesting products query
        productApi.endpoints.fetchRequestingProducts.query();
        // Optionally, you can also refetch other queries if needed
        // productApi.endpoints.fetchAllProducts.query();

        console.log('Product updated successfully');
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product', error);
    }
  };

  if (fetchProductsLoading) {
    return <div>Loading products data...</div>;
  }

  if (fetchProductsError) {
    return <Alert severity="error">Error loading products data!</Alert>;
  }

  return (
    <>
      <Header title="Product list" subtitle="product list" />
      <Container>
        <div className="d-flex j-spacebtw itemcenter">
          <Typography variant="h1">Product</Typography>
        </div>
        <SearchProduct />
        <div>
          {' '}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                    console.log('Row', row);
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === 'button' ? (
                                <div>
                                  <Link to={`/admin/products/${row.objectId}`}>
                                    <IconButton>
                                      <ViewIcon color="view" />
                                    </IconButton>
                                  </Link>

                                  <IconButton onClick={() => handleAgree(row.objectId)}>
                                    <Check color="success" />
                                  </IconButton>

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
                                      {'Delete Product'}
                                    </DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id="alert-dialog-description">
                                        Do you want to delete this product({row.name}) ?
                                      </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleCloseDialog} color="nonAction">
                                        CANCEL
                                      </Button>
                                      <Button
                                        onClick={() => handleDelete(row.objectId)}
                                        autoFocus
                                        color="error"
                                      >
                                        DELETE
                                      </Button>
                                    </DialogActions>
                                    {deleteProductLoading && <div>Deleting product...</div>}
                                    {deleteProductError && <div>Error deleting product!</div>}
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

export default ProductReqeusting;
