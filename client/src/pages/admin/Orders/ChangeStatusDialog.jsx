import React from 'react';
import { useState, useEffect } from 'react';
import { useFetchOrderByIdQuery, useUpdateStatusByIdMutation } from '../../../redux/store';
import {
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  Select,
  Box,
  Avatar,
  MenuItem,
  InputLabel,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const textFieldStyle = {
  margin: '12px 0px',
};

const buttonStyle = {
  flexGrow: '0',
  marginRight: '16px',
  color: '#fff',
};

const ChangeStatusOrder = (id) => {
  const objectId = id?.id;
  const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
    refetch,
  } = useFetchOrderByIdQuery(objectId);
  const [open, setOpen] = React.useState(false);
  const [editStatus, { isLoading: editStatusLoading, isError: editStatusError }] =
    useUpdateStatusByIdMutation();
  const [order, setOrder] = useState({});
  //for Form: Muiltiple textfields
  const defaultForm = {
    id: '',
    productName: '',
    date: '',
    username: '',
    email: '',
    phone: '',
    payment: '',
    shop: '',
    status: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    getOrder();
    refetch();
  }, [orderData]);

  const getOrder = () => {
    if (orderData?.data) {
      setOrder(orderData?.data?.doc);
      setFormData({
        id: order?._id,
        productName: order?.orderItems?.[0]?.product?.name,
        date: orderData?.data?.doc?.createdAt,
        username: orderData?.data?.doc?.user?.username || '',
        email: orderData?.data?.doc?.user?.email || '',
        phone: orderData?.data?.doc?.user?.phone,
        payment: orderData?.data?.doc?.paymentMethod,
        shop: orderData?.data?.doc?.fromShop?.name,
        status: orderData?.data?.doc?.status,
      });
    }
  };

  if (orderLoading) {
    return <div>Loading order details...</div>;
  }

  if (orderError) {
    return <Alert severity="error">Error loading order details!</Alert>;
  }
  if (!orderData) {
    return <div>No user data available</div>;
  }

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({
      ...formData,
      status: orderData?.data?.doc?.status || '',
    });

    setOpen(false);
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create a new object with non-empty fields
      const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      // Check if there are any non-empty fields to update
      if (Object.keys(updatedFields).length === 0) {
        console.log('No fields to update.');
        return;
      }
      const result = await editStatus(updatedFields);
      // Reset the form to the initial state
      setFormData(defaultForm);
      // Close the modal
      setOpen(false);
      await refetch();
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <>
      <IconButton onClick={handleClickOpenModal}>
        <EditIcon color="success" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <div className="d-flex j-spacebtw">
            <Typography
              sx={{ marginBottom: '10px' }}
              id="modal-modal-title"
              variant="h2"
              component="h2"
            >
              Edit Order
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="d-flex j-spacebtw">
            <div className="formField">
              <form onSubmit={handleFormSubmit}>
                <InputLabel id="demo-simple-select-label2">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label2"
                  id="demo-simple-select"
                  value={formData.status}
                  label="Status"
                  name="status"
                  onChange={handleFormChange}
                  className="formField-text"
                  sx={{ marginBottom: '12px' }}
                  MenuProps={{
                    sx: {
                      '& .Mui-selected': {
                        backgroundColor: '#F3D8C7',
                      },
                    },
                  }}
                >
                  <MenuItem value={'pending'}>pending</MenuItem>
                  <MenuItem value={'canceled'}>canceled</MenuItem>
                  <MenuItem value={'Not yet Refund'}>Not yet Refund</MenuItem>
                  <MenuItem value={'shipped'}>shipped</MenuItem>
                  <MenuItem value={'delivered'}>delivered</MenuItem>
                  <MenuItem value={'refunded'}>refunded</MenuItem>
                </Select>

                <TextField
                  id="outlined-controlled"
                  label="Order ID"
                  name="ID"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.id}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="ProductName"
                  name="ProductName"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.productName}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Shop"
                  name="shop"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.shop}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Date"
                  name="Date"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.date}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Username"
                  name="Username"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.username}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Phone"
                  name="phone"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.phone}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="PaymentMethod"
                  name="paymentMethod"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.payment}
                  onChange={handleFormChange}
                  disabled
                ></TextField>
                <Button
                  style={buttonStyle}
                  color="view"
                  variant="contained"
                  type="submit"
                  disabled={editStatusLoading}
                  className="btn-custom"
                >
                  save
                </Button>
                <Button
                  style={buttonStyle}
                  color="nonAction"
                  variant="contained"
                  onClick={handleCloseModal}
                  disabled={editStatusLoading}
                  className="btn-custom"
                >
                  Cancel
                </Button>
                {editStatusLoading && <div>Editting status...</div>}
                {editStatusError && <div>Error editting status!</div>}
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ChangeStatusOrder;
