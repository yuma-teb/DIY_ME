// import React, { useEffect } from 'react';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ViewIcon from '@mui/icons-material/Visibility';
// import {
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Alert,
// } from '@mui/material';
// import { useDeleteOrderByIdMutation, useFetchAllOrdersQuery } from '../../../redux/store';
// import StatusType from '../../admin/Orders/StatusStyle';
// import ChangeStatusOrder from '../../admin/Orders/ChangeStatusDialog';
// import '../../admin/Orders/Order.css';
// import SearchOrder from '../../admin/Orders/SearchOrder';
// import Header from '../../../components/admin/Common/Header';
// function OrderPage() {
//   const {
//     data: allOrdersData,
//     error: fetchOrdersError,
//     isLoading: fetchOrdersLoading,
//     refetch,
//   } = useFetchAllOrdersQuery();
//   const [deleteById, { error: deleteOrderError, isLoading: deleteOrderLoading }] =
//     useDeleteOrderByIdMutation();
//   const totalOrders = allOrdersData?.data?.result;
//   const orders = allOrdersData?.data?.docs || [];

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [dialog, setDialog] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleOpenDialog = (orderId) => {
//     setDialog(orderId);
//   };

//   const handleCloseDialog = () => {
//     setDialog(null);
//   };

//   const handleDelete = async (orderId) => {
//     deleteById(orderId);
//     setDialog(null);
//     await refetch();
//   };

//   const columns = [
//     {
//       id: 'id',
//       label: `Order ID`,
//     },
//     {
//       id: 'product',
//       label: 'Product',
//       align: 'center',
//     },
//     {
//       id: 'date',
//       label: 'Date',
//       align: 'center',
//       minWidth: 100,
//     },
//     {
//       id: 'user',
//       label: 'Customer',
//       align: 'center',
//     },
//     {
//       id: 'total',
//       label: 'Total',
//       align: 'center',
//     },
//     {
//       id: 'payment',
//       label: 'Payment',
//       align: 'center',
//     },
//     {
//       id: 'shop',
//       label: 'Shop',
//       align: 'center',
//     },
//     {
//       id: 'status',
//       label: 'Status',
//       align: 'center',
//       sortable: true,
//     },
//     {
//       id: 'button',
//       label: 'Actions',
//       align: 'center',
//     },
//   ];

//   if (fetchOrdersLoading) {
//     return <div>Loading orders data...</div>;
//   }

//   if (fetchOrdersError) {
//     return <Alert severity="error">Error loading orders data!</Alert>;
//   }

//   const ccyFormat = (num) => {
//     return `${num.toFixed(2)}`;
//   };
//   const createData = (id, product, date, user, total, payment, shop, status) => {
//     return { id, product, date, user, total, payment, shop, status };
//   };
//   const createDataFromOrder = (order, index) => {
//     const { _id, totalAmount, paymentMethod, createdAt, user, orderItems, fromShop, status } =
//       order;
//     const date = new Date(createdAt).toLocaleDateString('en-us');
//     const productName = orderItems?.[0]?.product?.name || 'Product Name Not Available';
//     const customerName = user?.username || 'Customer Name Not Available';
//     const shopName = fromShop?.name || 'Shop is not Available';

//     return createData(
//       _id,
//       `${productName}, ${orderItems.length - 1} more`,
//       date,
//       customerName,
//       `$${ccyFormat(totalAmount)}`,
//       paymentMethod,
//       shopName,
//       status,
//     );
//   };

//   const searchDivStyle = {
//     width: '100%',
//   };

//   const rowsFromOrders = Array.isArray(orders)
//     ? orders.map((order, index) => createDataFromOrder(order, index))
//     : [];
//   const rows = [...rowsFromOrders];

//   return (
//     <div className="order-page-container">
//       <Header title="Oder List" subtitle="orderlist" />
//       <div className="d-flex j-spacebtw itemcenter">
//         <SearchOrder style={searchDivStyle} />
//         <div>
//           <Button variant="contained" color="primary">
//             Filter
//           </Button>
//         </div>
//       </div>
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer sx={{ maxHeight: 918 }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ minWidth: column.minWidth, zIndex: 1 }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell
//                           key={column.id}
//                           align={column.align}
//                           style={column.id === 'status' ? StatusType(value) : {}}
//                         >
//                           {column.id === 'button' ? (
//                             <div className="ord-btn">
//                               <Link to={`/admin/orders/${row.id}`}>
//                                 <IconButton>
//                                   <ViewIcon color="view" />
//                                 </IconButton>
//                               </Link>
//                               <ChangeStatusOrder id={row.id} />
//                               <IconButton onClick={() => handleOpenDialog(row.id)}>
//                                 <DeleteIcon color="error" />
//                               </IconButton>
//                               <Dialog
//                                 open={dialog && dialog == row.id}
//                                 onClose={handleCloseDialog}
//                                 aria-labelledby="alert-dialog-title"
//                                 aria-describedby="alert-dialog-description"
//                               >
//                                 <DialogTitle id="alert-dialog-title">{'Delete Order'}</DialogTitle>
//                                 <DialogContent>
//                                   <DialogContentText id="alert-dialog-description">
//                                     Do you want to delete this orderID ? {row.id}
//                                   </DialogContentText>
//                                 </DialogContent>
//                                 <DialogActions>
//                                   <Button onClick={handleCloseDialog}>CANCEL</Button>
//                                   <Button onClick={() => handleDelete(row.id)} autoFocus>
//                                     DELETE
//                                   </Button>
//                                 </DialogActions>
//                                 {deleteOrderLoading && <div>Deleting order...</div>}
//                                 {deleteOrderError && <div>Error deleting order!</div>}
//                               </Dialog>
//                             </div>
//                           ) : column.format && typeof value === 'number' ? (
//                             column.format(value)
//                           ) : (
//                             value
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 100]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </div>
//   );
// }

// export default OrderPage;
