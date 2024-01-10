import React, { useEffect } from 'react';
import { useState } from 'react';
import { useFetchAllUsersQuery } from '../../../redux/api/UserApi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { IconButton, Paper } from '@mui/material';
import ViewIcon from '@mui/icons-material/Visibility';
import Header from '../../../components/admin/Common/Header';

export default function index() {
  const { data, error, isLoading } = useFetchAllUsersQuery();
  console.log(data);
  const totalUser = data?.results;
  const users = data?.data?.users || [];
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
      id: 'button',
      label: 'Actions',
    },
  ];

  if (isLoading) {
    console.log('Featching Data');
  }
  if (error) {
    console.log('Error Fetching: ', error);
  }
  const createData = (id, username, email, role, objectId) => {
    return { id, username, email, role, objectId };
  };
  const createDataFromUser = (user, index) => {
    const { username, email, role, _id } = user;
    return createData(index, username, email, role, _id);
  };
  const rowsFromUsers = Array.isArray(users)
    ? users.map((user, index) => createDataFromUser(user, index))
    : [];
  const rows = [...rowsFromUsers];

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
      {' '}
      <Header title="Users" subtitle="Users" />
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 5 }}>
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
                              <IconButton>
                                <ViewIcon color="view" />
                              </IconButton>
                              {/* <IconButton>
                                <EditIcon color="success" />
                              </IconButton>
                              <IconButton>
                                <DeleteIcon color="error" />
                              </IconButton> */}
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
}
