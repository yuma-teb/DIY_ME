import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useDeleteReplyMutation } from '../../.././redux/api/CommentsApi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreateReport from '../../../pages/BulletinBoard/Community/CreateReport';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Reply = ({ reply, comment }) => {
  const { username, reply: replyText, user: replyUser } = reply || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const replyId = reply?._id;
  const commentId = comment?._id;
  console.log(commentId);
  const [deleteReply, { isLoading: deleteReplyLoading, isError: deleteReplyError }] =
    useDeleteReplyMutation() || {};

  const { postId } = useParams();
  // const user = useSelector((state) => state.auth.user);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMoreHorizClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreHorizClose = () => {
    setAnchorEl(null);
  };

  const isCurrentUser = user.id === replyUser.id;

  console.log(isCurrentUser);
  console.log(user.id);
  console.log(replyUser);

  const handleReportClick = () => {
    setIsReportDialogOpen(true);
    handleMoreHorizClose();
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
  };

  const handleModifyClick = () => {
    console.log('Modifying click');
    handleMoreHorizClose();
  };

  //Delete function
  const handleOpenDialog = (replyId) => {
    setDialog(replyId);
  };
  const handleCloseDialog = () => {
    setDialog(null);
    handleMoreHorizClose();
  };

  const handleDeleteClick = async (replyId, commentId) => {
    deleteReply({commentId: comment?._id, 
      replyId: reply?._id});
    handleMoreHorizClose();
  };

  return (
    <>
      <Card elevation={0} sx={{ marginTop: '8px', backgroundColor: '#F0F0F0', marginLeft: '60px' }}>
        <CardHeader
          avatar={<Avatar>{username[0]}</Avatar>}
          title={username}
          subheader={new Date(reply?.createdAt).toLocaleDateString()}
          action={
            <div>
              <IconButton onClick={handleMoreHorizClick}>
                <MoreHorizIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreHorizClose}>
                {isCurrentUser ? (
                  [
                    <MenuItem key="modify" onClick={handleModifyClick}>
                      Modify
                    </MenuItem>,
                    <div>
                      <MenuItem key="delete" onClick={() => handleOpenDialog(replyId)}>
                        Delete
                      </MenuItem>
                      {dialog !== null && (
                        <Dialog
                          open={dialog && dialog === replyId}
                          onClose={handleCloseDialog}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">{'Delete ReplyId'}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Do you want to delete this reply comment?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseDialog}>CANCEL</Button>
                            <MenuItem
                              key="delete"
                              onClick={() => handleDeleteClick(replyId)}
                              autoFocus
                            >
                              Delete
                            </MenuItem>
                          </DialogActions>
                          {deleteReplyLoading && <div>Deleting Reply Comment...</div>}{' '}
                          {/*Add style later */}
                          {deleteReplyError && <div>Error Deleting Reply Comment!</div>}
                        </Dialog>
                      )}
                    </div>,
                  ]
                ) : (
                  <MenuItem onClick={handleReportClick}>Report</MenuItem>
                )}
              </Menu>
            </div>
          }
        />
        <CardContent sx={{ marginLeft: '60px' }}>
          <Typography variant="body1">{replyText}</Typography>
        </CardContent>
      </Card>
      {isReportDialogOpen && (
        <CreateReport
          open={isReportDialogOpen}
          onClose={handleCloseReportDialog}
          postId={postId}
          commentId={comment?._id}
          replyId={reply?._id}
        />
      )}
    </>
  );
};

export default Reply;
