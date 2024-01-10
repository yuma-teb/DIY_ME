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
  Button,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CommentIcon from '@mui/icons-material/Comment';
import { useAddReplyMutation, useDeleteCommentMutation } from '../../.././redux/api/CommentsApi';
import Reply from '../Reply';
import { useParams } from 'react-router-dom';
import RegisterComment from '../RegisterComment';
import CreateReport from '../../../pages/BulletinBoard/Community/CreateReport';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Comment = ({ comment }) => {
  const [showReplyBox, setShowReplyBox] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isUpdated, setIsUpdate] = useState(false);
 
  const user = JSON.parse(localStorage.getItem('user'));
  const { postId } = useParams();
  const commentId = comment?._id;
  const [deleteComment, { error: deleteCommentError, isLoading: deleteCommentLoading }] =
    useDeleteCommentMutation();
  const [addReply, { isLoading: addReplyLoading, isError: addReplyError }] =
    useAddReplyMutation() || {};

  const handleMoreHorizClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreHorizClose = () => {
    setAnchorEl(null);
  };

  const isCurrentUser = user.id === comment.user;

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
    setShowReplyBox(2)
    setIsUpdate(true);
  };

  //open dialogue delete button
  const handleOpenDialog = (commentId) => {
    setDialog(commentId);
  };
  const handleCloseDialog = () => {
    setDialog(null);
    handleMoreHorizClose();
  };

  const handleDeleteClick = async (commentId) => {
    deleteComment(commentId);
    handleMoreHorizClose();
  };

  return (
    <>
      <Card elevation={0} sx={{ marginTop: '16px', backgroundColor: '#F0F0F0' }}>
        <CardHeader
          avatar={<Avatar>{comment?.username[0]}</Avatar>}
          title={comment?.username}
          subheader={new Date(comment?.createdAt).toLocaleDateString()}
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
                      <MenuItem key="delete" onClick={() => handleOpenDialog(commentId)}>
                        Delete
                      </MenuItem>
                      {dialog !== null && (
                        <Dialog
                          open={dialog && dialog === commentId}
                          onClose={handleCloseDialog}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">{'Delete CommentId'}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Do you want to delete this comment?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseDialog}>CANCEL</Button>
                            <MenuItem
                              key="delete"
                              onClick={() => handleDeleteClick(commentId)}
                              autoFocus
                            >
                              Delete
                            </MenuItem>
                          </DialogActions>
                          {deleteCommentLoading && <div>Deleting Comment...</div>}{' '}
                          {/*Add style later */}
                          {deleteCommentError && <div>Error deleting Comment!</div>}
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
        <CardContent>
          <Typography sx={{ marginLeft: '55px' }} variant="body1">
            {comment?.comment}
          </Typography>
        </CardContent>
        <div>
          <IconButton
            sx={{ marginLeft: '60px' }}
            variant="outlined"
            onClick={() => setShowReplyBox(1)}
          >
            <CommentIcon />
            <Typography variant="body2">Reply</Typography>
          </IconButton>
          {showReplyBox === 1 ? (
            <RegisterComment
              initialText={`@${comment?.username} : `}
              onSubmit={(replyContent) => {
                addReply({
                  commentId: comment?._id,
                  data: {
                    commentId: comment?._id,
                    username: user.username,
                    reply: replyContent,
                    user: user.id,
                  },
                });
                setShowReplyBox('');
              }}
            />
          ) : showReplyBox === 2 ? (
            <RegisterComment
              updateComment={isUpdated}
              dataComment={comment}
            />
          ) : ''}
        </div>

        {comment?.replies?.length > 0 &&
          comment?.replies?.map((reply, i) => {
            return <Reply key={reply?._id} reply={reply} comment={comment} />;
          })}
      </Card>
      {isReportDialogOpen && (
        <CreateReport
          open={isReportDialogOpen}
          onClose={handleCloseReportDialog}
          postId={postId}
          commentId={comment?._id}
        />
      )}
    </>
  );
};

export default Comment;
