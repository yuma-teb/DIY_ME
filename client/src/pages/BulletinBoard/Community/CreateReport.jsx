import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddReportMutation } from '../../../redux/api/ReportApi';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';

const CreateReport = ({ open, onClose, postId, commentId, replyId }) => {
  const navigate = useNavigate();

  const [addReport, { isLoading: addReportLoading, isError: addReportError }] =
    useAddReportMutation() || {};

  const [objective, setObjective] = useState('');

  const user = useSelector((state) => state.auth.user);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await addReport({
        user: user.id,
        username: user.username,
        objective,
        postId,
        commentId,
        replyId,
      });

      if (data) {
        setObjective('');
        onClose(true);
        navigate(`/community/${postId}`);
      }
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleCancel = () => {
    onClose(true);
    navigate(`/community/${postId}`);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Do you want to report?</DialogTitle>
      <DialogContent>
        <TextField
          required
          variant="outlined"
          autoFocus
          margin="dense"
          // id="report-objective"
          // label="Require"
          placeholder="Write objective..."
          type="text"
          fullWidth
          multiline
          rows={3}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={submitHandler} disabled={addReportLoading}>
          {addReportLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
      {addReportLoading && <div>Submitting report...</div>}
      {addReportError && <Alert severity="error">Objective Required!</Alert>}
    </Dialog>
  );
};

export default CreateReport;
