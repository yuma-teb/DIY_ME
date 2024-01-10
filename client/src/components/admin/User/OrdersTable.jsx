import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Paper, IconButton } from '@mui/material';
import ViewIcon from '@mui/icons-material/Visibility';

const columns = [
  { id: 'id', label: 'Index', align: 'center' },
  // { id: 'profile', label: 'Profile' },
  {
    id: 'product',
    label: 'Products',
    // minWidth: 180,
    align: 'center',
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'date',
    label: 'Created At',
    // minWidth: 170,
    align: 'center',
  },
  {
    id: 'total',
    label: 'Total',
    align: 'center',
    format: (value) => Number(value).toFixed(2),
  },
  {
    id: 'payment',
    label: 'Payment Method',
    align: 'right',
    minWidth: 100,
  },
  {
    id: 'shop',
    label: 'Shop',
    align: 'center',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'objectId',
    label: 'DB Id',
    align: 'center',
  },
  {
    id: 'button',
    label: 'Actions',
    align: 'center',
  },
];

const paperStyle = { width: '100%', overflow: 'hidden' };

const OrdersTable = (user) => {
  const userData = user?.user;
  const orders = userData?.orders;
  //   console.log(orders);

  const createData = (id, product, date, total, payment, shop, status, objectId) => {
    return { id, product, date, total, payment, shop, status, objectId };
  };
  const createDataFromUser = (order, index) => {
    const { orderItems, createdAt, totalAmount, paymentMethod, fromShop, status, _id } = order;
    const productDis = orderItems?.[0].product?.name || 'Product name not available';
    const Created = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedStatus =
      status === 'pending' ? (
        <span style={{ color: '#e46a11' }}>Pending</span>
      ) : status === 'on the way' ? (
        <span style={{ color: 'purple' }}>On the Way</span>
      ) : status === 'shipped' ? (
        <span style={{ color: '#13b2e4' }}>Shipped</span>
      ) : status === 'delivered' ? (
        <span style={{ color: 'green' }}>Delivered</span>
      ) : status === 'canceled' ? (
        <span style={{ color: 'red' }}>Canceled</span>
      ) : status === 'Not yet Refund' ? (
        <span style={{ color: '#f1c21b' }}>Not yet Refund</span>
      ) : status === 'refunded' ? (
        <span style={{ color: '#2fb390' }}>Refunded</span>
      ) : (
        status
      );
    const fromShopName = fromShop?.name || 'Shop is not listed';
    return createData(
      index + 1,
      productDis,
      Created,
      totalAmount,
      paymentMethod,
      fromShopName,
      formattedStatus,
      _id,
    );
  };
  const rowsFromOrders = Array.isArray(orders)
    ? orders.map((order, index) => createDataFromUser(order, index))
    : [];
  const rows = [...rowsFromOrders];
  // console.log(rows);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div>
      <Paper>
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'button' ? (
                            <div>
                              <Link to={`/admin/orders/${row.objectId}`}>
                                <IconButton>
                                  <ViewIcon color="view" />
                                </IconButton>
                              </Link>
                            </div>
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
    </div>
  );
};

export default OrdersTable;
