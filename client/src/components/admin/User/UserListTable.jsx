import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchAllUsersQuery, useRemoveUserMutation } from '../../../redux/store';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from '@mui/material';
import UserEditModal from './UserEditModal';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';

const UserListTable = () => {
  const {
    data: userData,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchAllUsersQuery();
  const [deleteById, { error: deleteUserError, isLoading: deleteUserLoading }] =
    useRemoveUserMutation();
  const [dialog, setDialog] = useState(false);
  // console.log(userData);
  const totalUser = userData?.results;
  const users = userData?.data?.docs || [];
  // console.log(users);
  const columns = [
    { id: 'id', label: 'Table ID' },
    // { id: 'profile', label: 'Profile' },
    {
      id: 'username',
      label: 'User Name',
      // minWidth: 180,
      align: 'right',
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
      align: 'right',
      minWidth: 100,
    },
    {
      id: 'role',
      label: 'Role',
      align: 'right',
    },
    {
      id: 'objectId',
      label: 'DB Id',
    },
    {
      id: 'isActive',
      label: 'Active',
      format: (value) => (value ? 'Active' : 'Inactive'),
    },
    {
      id: 'button',
      label: 'Actions',
    },
  ];

  if (fetchUserLoading) {
    return <div>Loading users data...</div>;
  }
  if (fetchUserError) {
    return <Alert severity="error">Error loading users data!</Alert>;
  }
  const createData = (id, username, email, role, isActive, objectId) => {
    return { id, username, email, role, isActive, objectId };
  };
  const createDataFromUser = (user, index) => {
    const { username, email, role, isActive, _id } = user;
    return createData(index + 1, username, email, role, isActive, _id);
  };
  const rowsFromUsers = Array.isArray(users)
    ? users.map((user, index) => createDataFromUser(user, index))
    : [];
  const rows = [...rowsFromUsers];
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
  const handleOpenDialog = (userId) => {
    setDialog(userId);
  };

  const handleCloseDialog = () => {
    setDialog(null);
  };

  const handleDelete = async (userId) => {
    await deleteById(userId);
    setDialog(null);
  };

  return (
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
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'button' ? (
                            <div>
                              <Link to={`/admin/users/${row.objectId}`}>
                                <IconButton>
                                  <ViewIcon color="view" />
                                </IconButton>
                              </Link>
                              <UserEditModal id={row.objectId} />
                              <IconButton onClick={() => handleOpenDialog(row.objectId)}>
                                <DeleteIcon color="error" />
                              </IconButton>
                              <Dialog
                                open={dialog === row.objectId}
                                onClose={handleCloseDialog}
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
                                  <Button color="nonAction" onClick={handleCloseDialog}>
                                    CANCEL
                                  </Button>
                                  <Button
                                    color="error"
                                    onClick={() => handleDelete(row.objectId)}
                                    autoFocus
                                  >
                                    DELETE
                                  </Button>
                                </DialogActions>
                                {deleteUserLoading && <div>Deleting user...</div>}
                                {deleteUserError && <div>Error deleting user!</div>}
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
  );
};

export default UserListTable;
