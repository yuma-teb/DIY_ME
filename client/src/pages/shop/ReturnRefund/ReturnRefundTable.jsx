import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  useFetchShopRefundReturnQuery,
  useDeleteRefundReturnByIdMutation,
} from '../../../redux/api/RefundReturnApi';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { IconButton, Paper } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import ChangeStatusRefund from './ChangeStatusDialog';
import Header from '../../../components/admin/Common/Header';
import { useNavigate } from 'react-router-dom';
import '../../../index.css';
const user = JSON.parse(localStorage.getItem('token'));
console.log('USER', user);
const RefundReturnTable = () => {
  const {
    data,
    refetch,
    error: fetchRefundReturnError,
    isLoading: fetchRefundReturnLoading,
  } = useFetchShopRefundReturnQuery(user?.shop);

  const [
    deleteRefundById,
    { error: deleteRefundReturnError, isLoading: deleteRefundReturnLoading },
  ] = useDeleteRefundReturnByIdMutation();

  const refunds = data?.data?.docs || [];
  const navigate = useNavigate();
  const columns = [
    {
      id: 'id',
      label: 'Table ID',
    },
    {
      id: 'username',
      label: 'User Name',
    },
    {
      id: 'order_id',
      label: 'Order ID',
    },
    {
      id: 'product_name',
      label: 'Product Name',
    },
    {
      id: 'shop',
      label: 'Shop',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'action',
      label: 'Action',
    },
    {
      id: 'button',
      label: 'More',
      minWidth: 152,
    },
  ];

  const createData = (
    id,
    username,
    order_id,
    product_name,
    price,
    shop,
    status,
    reason,
    action,
    refund_id,
  ) => {
    return { id, username, order_id, product_name, price, shop, status, reason, action, refund_id };
  };
  const createDataFromUser = (refund, index) => {
    const refundId = refund?._id || '';
    const username = refund.order?.user?.username || '';
    const order_id = refund.order?.id || '';
    const product_name = refund.product[0]?.name || '';
    const price = refund.product?.price || '';
    const shop = refund.order?.fromShop?.name || '';
    const status = refund.isRefund ? 'Refund' : refund.isReturn ? 'Return' : 'Unknown';
    const reason = refund.reason || '';
    const action = refund.status || '';

    return createData(
      index + 1,
      username,
      order_id,
      product_name,
      price,
      shop,
      status,
      reason,
      action,
      refundId,
    );
  };

  const rowsFromRefunds = Array.isArray(refunds)
    ? refunds.map((refund, index) => createDataFromUser(refund, index))
    : [];
  const rows = [...rowsFromRefunds];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (fetchRefundReturnLoading) {
    return <div>Loading RefundReturn data...</div>;
  }

  if (fetchRefundReturnError) {
    console.log('Error');
    console.log('Error: ', fetchRefundReturnError);
    return <Alert severity="error">Error loading RefundReturn data!</Alert>;
  }
  const handleOpenDialog = (refundId) => {
    setDialog(refundId);
  };

  const handleCloseDialog = () => {
    setDialog(null);
  };

  const handleDelete = async (refundId) => {
    deleteRefundById(refundId);
    setDialog(null);
    await refetch();
  };

  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <div className="selfcenter">{column.label}</div>
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
                              <IconButton
                                onClick={() => navigate(`/admin/returnrefund/${row.refund_id}`)}
                              >
                                <ViewIcon color="view" />
                              </IconButton>
                              <ChangeStatusRefund id={row.refund_id} />
                              <IconButton onClick={() => handleOpenDialog(row.refund_id)}>
                                <DeleteIcon color="error" />
                              </IconButton>
                              {dialog !== null && (
                                <Dialog
                                  open={dialog && dialog === row.refund_id}
                                  onClose={handleCloseDialog}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {'Delete RefundID'}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Do you want to delete this RefundID ? {row.refund_id}
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleCloseDialog}>CANCEL</Button>
                                    <Button onClick={() => handleDelete(row.refund_id)} autoFocus>
                                      DELETE
                                    </Button>
                                  </DialogActions>
                                  {deleteRefundReturnLoading && <div>Deleting RefundReturn...</div>}
                                  {deleteRefundReturnError && (
                                    <div>Error deleting RefundReturn!</div>
                                  )}
                                </Dialog>
                              )}
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

export default RefundReturnTable;
