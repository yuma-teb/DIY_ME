import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFetchShopByIdQuery } from '../../../redux/api/ShopApi';

import {
  Grid,
  Avatar,
  Paper,
  Divider,
  ListItem,
  ListItemText,
  List,
  Typography,
  Card,
  CardContent,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import CartIcon from '@mui/icons-material/ShoppingCart';
// import OrdersTable from '../../../components/admin/shop/OrdersTable';

const ShopDetail = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { id } = useParams();
  const { data, error: fetchShopError, isLoading: fetchShopLoading } = useFetchShopByIdQuery(id);
  const [shop, setshop] = useState({});
  console.log('THIS WAY');
  const [products, setProducts] = useState([]);
  const getshop = () => {
    if (data?.data) {
      setshop(data?.data?.shop);
      setProducts(data?.data?.shop?.products);
    }
  };
  console.log('THIS WAY 2');
  useEffect(() => {
    getshop();
  }, [data]);
  console.log('THIS WAY 3');
  if (fetchShopLoading) {
    return <div>Loading shop details...</div>;
  }

  if (fetchShopError) {
    return <Alert severity="error">Error loading shop details!</Alert>;
  }
  if (!data) {
    return <div>No shop data available</div>;
  }
  function generate(props) {
    return [0].map((value) => (
      <ListItem key={value} {...props}>
        <ListItemIcon>
          {/* Cutomize Icons passed to props */}
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.primarytext} secondary={props.secondarytext} />
      </ListItem>
    ));
  }

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
  ];

  // if (isLoading) {
  //   console.log('error fetching user data!');
  // }
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

  console.log('THIS WAY 10');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  console.log('THIS WAY 5');
  return (
    <>
      <Container>
        <Typography variant="h1" mb={2}>
          shop Detail
        </Typography>
        {data && (
          <Grid container spacing={2}>
            <Grid item lg={4.5}>
              <Paper className="profile d-flex flex-col">
                <div className="profile-cardBG d-flex flex-col itemcenter">
                  <Avatar className="avatar">{shop?.shopname ? shop?.shopname[0] : 'N/A'}</Avatar>
                  <Typography variant="h2" mb={2}>
                    Hello
                  </Typography>
                </div>
                <Divider variant="middle" />
                <List>
                  {generate({
                    icon: <LockIcon />,
                    primarytext: 'shop ID',
                    secondarytext: `${shop?._id}`,
                  })}
                  {generate({
                    icon: <EmailIcon />,
                    primarytext: 'Email',
                    secondarytext: `${shop?.email}`,
                  })}
                  {generate({
                    icon: <PhoneIcon />,
                    primarytext: 'Phone',
                    secondarytext: `${shop?.phone}`,
                  })}
                  {generate({
                    icon: <PlaceIcon />,
                    primarytext: 'Address',
                    secondarytext: `${shop?.address}`,
                  })}
                  {generate({
                    icon: <CartIcon />,
                    primarytext: 'Latest Order',
                    secondarytext: `${shop?.order}`,
                  })}
                </List>
              </Paper>
            </Grid>
            <Grid item lg={7.5}>
              <Grid container spacing={2}>
                <Grid item lg={6}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <div className="d-flex flex-col">
                        <Typography variant="h2" component="div" className="self-right">
                          Total Orders
                        </Typography>
                        <Typography
                          variant="h1"
                          color={'green'}
                          component="div"
                          className="selfcenter"
                        >
                          {shop?.orders?.length || 0}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={6}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <div className="d-flex flex-col">
                        <Typography variant="h2" component="div" className="self-right">
                          Total Product
                        </Typography>
                        <Typography
                          variant="h1"
                          color={'green'}
                          component="div"
                          className="selfcenter"
                        >
                          {shop?.products?.length || 0}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item lg={12}>
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
                            {rows
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => {
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
                                              <Link to={`/admin/products/${row.objectId}/edit`}>
                                                <IconButton>
                                                  <EditIcon color="success" />
                                                </IconButton>
                                              </Link>
                                              <IconButton
                                                onClick={() => handleOpenDialog(row.objectId)}
                                              >
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
                                                  <Button
                                                    onClick={handleCloseDialog}
                                                    color="nonAction"
                                                  >
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default ShopDetail;
