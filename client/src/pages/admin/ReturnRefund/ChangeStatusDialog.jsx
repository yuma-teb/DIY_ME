import React from 'react';
import { useState, useEffect } from 'react';
import {
  useFetchRefundReturnByIdQuery,
  useUpdateRefundReturnByIdMutation,
} from '../../../redux/api/RefundReturnApi';
import {
  Button,
  Modal,
  Typography,
  IconButton,
  Select,
  Box,
  MenuItem,
  InputLabel,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const ChangeStatusOrder = (id) => {
  const objectId = id.id;
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
    data,
    error: fetchRefundReturnError,
    isLoading: fetchRefundReturnLoading,
    refetch,
  } = useFetchRefundReturnByIdQuery(objectId);
  const [open, setOpen] = React.useState(false);
  const [editStatus, { isLoading: editRefundReturnLoading, isError: editRefundReturnError }] =
    useUpdateRefundReturnByIdMutation();
  const [returnrefund, setReturnRefund] = useState({});

  const defaultForm = {
    id: data?.data?._id || '',
    status: data?.data?.status || '',
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    getRequest();

    refetch();
  }, [open, data]);

  const getRequest = () => {
    if (data?.data?.data) {
      setReturnRefund(data?.data?.data);
      setFormData({
        id: data?.data?.data?._id,
        status: data?.data?.data?.status,
      });
    }
  };

  if (fetchRefundReturnLoading) {
    return <div>Loading RefundReturn details...</div>;
  }

  if (fetchRefundReturnError) {
    return <Alert severity="error">Error loading RefundReturn details!</Alert>;
  }
  if (!data) {
    return <div>No user data available</div>;
  }

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(defaultForm);
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

      console.log('summit', formData);

      const result = await editStatus(formData);

      setFormData(result?.data?.data?.updateData?.status);
      setOpen(false);
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
              Edit Action
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
                  value={formData?.status}
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
                  <MenuItem value={'processing'}>processing</MenuItem>
                  <MenuItem value={'approved'}>approved</MenuItem>
                  <MenuItem value={'completed'}>completed</MenuItem>
                  <MenuItem value={'rejected'}>rejected</MenuItem>
                </Select>

                <Button
                  sx={{ flexGrow: '0', marginRight: '16px', color: '#fff' }}
                  color="view"
                  variant="contained"
                  type="submit"
                  disabled={editRefundReturnLoading}
                  className="btn-custom"
                >
                  save
                </Button>
                <Button
                  sx={{ flexGrow: '0', marginRight: '16px', color: '#fff' }}
                  color="nonAction"
                  variant="contained"
                  onClick={handleCloseModal}
                  disabled={editRefundReturnLoading}
                  className="btn-custom"
                >
                  Cancel
                </Button>
                {editRefundReturnLoading && <div>Editting RefundReturn...</div>}
                {editRefundReturnError && <div>Error editting RefundReturn!</div>}
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ChangeStatusOrder;
