import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useFetchOrderByIdQuery } from '../../../redux/store';
import { useParams } from 'react-router-dom';

const tableCellWidth = {
  width: '400px',
};

const OrderListDetail = () => {
  const { id } = useParams();
  const {
    data: orderData,
    error: fetchOrderError,
    isLoading: fetchOrderLoading,
  } = useFetchOrderByIdQuery(id);
  const orders = orderData?.data?.doc?.orderItems || [];

  if (fetchOrderLoading) {
    console.log('Loading...');
  }

  const TAX_RATE = 0.07;

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  };

  const priceRow = (qty, price) => {
    return qty * price;
  };

  const createRow = (_id, productName, qty, price) => {
    const total = priceRow(qty, price);
    return { _id, productName, qty, price, total };
  };

  const subtotal = (items) => {
    return items.map(({ total }) => total).reduce((total, i) => total + i, 0);
  };

  const createDataFromOrder = (order, index) => {
    const { id, qty } = order;
    const product = order?.product?.name || 'Product Name Not Available';
    console.log(product);
    const price = order?.product?.price;

    return createRow(product, id, qty, price);
  };

  const rowsFromOrders = Array.isArray(orders)
    ? orders.map((order, index) => createDataFromOrder(order, index))
    : [];
  const rows = [...rowsFromOrders];

  // const invoiceSubtotal = subtotal(rows);
  const total = subtotal(rows);
  // const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  // const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  if (fetchOrderLoading) {
    return <div>Loading orderList...</div>;
  }

  if (fetchOrderError) {
    return <Alert severity="error">Error loading orderList!</Alert>;
  }

  return (
    <TableContainer component={Paper} className="Ord-list-detail">
      <Table sx={{ width: '100%' }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="left" colSpan={6}>
              <span>OrderList</span>
              <span className="order-length">{orders.length} Products</span>
            </TableCell>
          </TableRow>
          <TableRow className="table-cell-desc">
            <TableCell align="center" style={tableCellWidth} colSpan={1}>
              Product
            </TableCell>
            <TableCell align="center" style={tableCellWidth}>
              ID
            </TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rows._id}>
              <TableCell align="center">{row._id}</TableCell>
              <TableCell align="center">{row.productName}</TableCell>
              <TableCell align="center">{row.qty}</TableCell>
              <TableCell align="center">${ccyFormat(row.price)}</TableCell>
              <TableCell align="center">${ccyFormat(row.total)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={2} colSpan={3} />
            <TableCell colSpan={1}>Total</TableCell>
            <TableCell align="center">${ccyFormat(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderListDetail;
