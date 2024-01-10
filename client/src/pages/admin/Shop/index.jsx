import React, { useEffect } from 'react';
import { useState } from 'react';
import { useFetchAllShopsQuery, useDeleteShopMutation } from '../../../redux/api/ShopApi';
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
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ShopList = () => {
  const navigate = useNavigate();
  const { data, error: fetchShopsError, isLoading: fetchShopsLoading } = useFetchAllShopsQuery();
  const [deleteById, { error: deleteUserError, isLoading: deleteUserLoading }] =
    useDeleteShopMutation();

  const [shops, setShops] = useState([]);
  console.log('DATA', data);
  useEffect(() => {
    // Call the API only if it's not loading and there is no error
    if (!fetchShopsLoading && !fetchShopsError && data?.data) {
      setShops(data?.data?.docs);
    }
  }, [data, fetchShopsError, fetchShopsLoading]);
  console.log(shops);
  const columns = [
    { id: 'id', label: 'Table ID' },
    // { id: 'profile', label: 'Profile' },
    {
      id: 'name',
      label: 'Shop name',
      // minWidth: 180,
      align: 'left',
      // format: (value) => value.toLocaleString('en-US'),
    },
    // {
    //   id: 'firstname',
    //   label: 'First Name',
    //   // minWidth: 170,
    //   align: 'right',
    //   // format: (value) => value.toLocaleString('en-US'),
    // },
    // {
    //   id: 'lastname',
    //   label: 'Last Name',
    //   align: 'right',
    //   // format: (value) => value.toFixed(2),
    // },
    {
      id: 'email',
      label: 'Email',
      align: 'left',
      minWidth: 100,
    },

    {
      id: 'objectId',
      label: 'DB Id',
    },
    {
      id: 'button',
      label: 'Actions',
    },
  ];

  const createData = (id, name, email, role, objectId, imageCoverLink) => {
    return { id, name, email, role, objectId, imageCoverLink };
  };
  const createDataFromUser = (user, index) => {
    const { name, email, role, _id, imageCoverLink } = user;
    return createData(index, name, email, role, _id, imageCoverLink);
  };
  const rowsFromshops = Array.isArray(shops)
    ? shops.map((user, index) => createDataFromUser(user, index))
    : [];
  const rows = [...rowsFromshops];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleOpenDialog = (userId) => {
    setDialog(userId);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // handle delete shop
  const handleDeleteShop = async (id) => {
    await deleteById(id);
    setDialog(null);
  };

  if (fetchShopsLoading) {
    return <div>Loading shops data...</div>;
  }

  if (fetchShopsError) {
    return <Alert severity="error">Error loading shops data!</Alert>;
  }
  return (
    <div>
      {' '}
      
      <Container>
        <Button
          variant="contained"
          component="label"
          onClick={() => navigate('/admin/shops/create')}
          sx={{ marginLeft: 'auto', marginRight: 2 }}
        >
          Add New Shop
        </Button>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 5 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  console.log(row.imageCoverLink);

                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        console.log(value);
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'button' ? (
                              <div>
                                <IconButton
                                  onClick={() => navigate(`/admin/shops/${row.objectId}`)}
                                >
                                  <ViewIcon color="view" />
                                </IconButton>
                                <IconButton
                                  onClick={() => navigate(`/admin/shops/${row.objectId}/edit`)}
                                >
                                  <EditIcon color="success" />
                                </IconButton>
                                <IconButton onClick={() => handleOpenDialog(row.objectId)}>
                                  <DeleteIcon color="error" />
                                </IconButton>
                                <Dialog
                                  open={dialog === row.objectId}
                                  onClose={() => setDialog(null)}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">{'Delete User'}</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Do you want to delete user "{row.username}"?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button color="nonAction" onClick={() => setDialog(null)}>
                                      CANCEL
                                    </Button>
                                    <Button
                                      color="error"
                                      onClick={() => handleDeleteShop(row.objectId)}
                                      autoFocus
                                    >
                                      DELETE
                                    </Button>
                                  </DialogActions>
                                  {deleteUserLoading && <div>Deleting user...</div>}
                                  {deleteUserError && <div>Error deleting user!</div>}
                                </Dialog>
                              </div>
                            ) : column.id === 'name' ? (
                              <>
                                <img
                                  src={row.imageCoverLink}
                                  style={{ width: '50px', height: '50px' }}
                                />{' '}
                                {value}
                              </>
                            ) : column.format && typeof value === 'number' ? (
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
      </Container>
    </div>
  );
};

export default ShopList;
