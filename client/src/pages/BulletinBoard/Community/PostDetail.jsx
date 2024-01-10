import React, { useState } from 'react';
import PostCard from '../../../components/BulletinBoard/PostCard';
import Comment from '../../../components/BulletinBoard/Comment';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchSinglePostQuery, useDeletePostMutation } from '../../../redux/api/PostsApi';
import { useAddCommentMutation, useFetchCommentsQuery } from '../../../redux/api/CommentsApi';
import { useSelector } from 'react-redux';
import RegisterComment from '../../../components/BulletinBoard/RegisterComment';
import CreateReport from './CreateReport';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton, Alert, Container } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const PostDetail = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user', user);
  const {
    data,
    error: fetchPostError,
    isLoading: fetchPostLoading,
  } = useFetchSinglePostQuery(postId) || {};
  const post = data?.data?.post || [];

  let {
    data: commentsData,
    error: fetchCommentsError,
    isLoading: fetchCommentsLoading,
  } = useFetchCommentsQuery(postId) || {};
  const comments = commentsData?.data?.newcomments || [];

  let totals = comments?.map((item) => item?.replies?.length);

  let totalComments = totals?.reduce((acc, item) => acc + item, 0);

  totalComments = totalComments + comments?.length;

  const [addComment, { isLoading: addCommentLoading, isError: addCommentError }] =
    useAddCommentMutation() || {};

  // deleting post by mutation
  const [deletePost, { error: deletePostError, isLoading: deletePostLoading }] =
    useDeletePostMutation();

  

  const handleMoreHorizClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreHorizClose = () => {
    setAnchorEl(null);
  };

  const handleReportClick = () => {
    setIsReportDialogOpen(true);
    handleMoreHorizClose();
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
  };

  const handleModifyClick = () => {
    navigate(`/community/${postId}/edit`);

    handleMoreHorizClose();
  };

  // const handleDeleteClick = () => {
  //   console.log('Deleting click');
  //   handleMoreHorizClose();
  // };
  // Open dialogue

  const handleOpenDialog = (postId) => {
    setDialog(postId);
    handleMoreHorizClose();
  };

  const handleCloseDialog = () => {
    setDialog(null);
    handleMoreHorizClose();
  };

  // Delete posts
  const handleDeleteClick = async (postId) => {
    deletePost(postId);
    navigate(`/community`);
    handleMoreHorizClose();
  };

  if (fetchPostLoading) {
    return <div>Loading post details...</div>;
  }

  if (fetchPostError) {
    return <Alert severity="error">Error loading post details!</Alert>;
  }

  const isCurrentUser = user.id === post.user;

  return (
    <>
      <div style={{ position: 'relative', marginTop: '72px' }}>
        {/* prop of showing full description from Postcard */}
        <PostCard post={post} showFullDescription={true} isLinkEnabled={false} />
        <div style={{ position: 'absolute', top: 0, right: 0, margin: '16px' }}>
          <IconButton onClick={handleMoreHorizClick}>
            <MoreHorizIcon />
          </IconButton>

          {/* old version */}
          {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreHorizClose}>
            {isCurrentUser ? (
              [
                <MenuItem key="modify" onClick={handleModifyClick}>
                  Modify
                </MenuItem>,
                <div>
                  <MenuItem key="delete" onClick={() => handleOpenDialog(postId)}>
                    Delete
                  </MenuItem>
                  {dialog !== null && (
                    <Dialog
                      open={dialog && dialog === postId}
                      onClose={handleCloseDialog}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{'Delete PostId'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Do you want to delete this post ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog}>CANCEL</Button>
                        <MenuItem key="delete" onClick={() => handleDeleteClick(postId)} autoFocus>
                          Delete
                        </MenuItem>
                      </DialogActions>
                      {deletePostLoading && <div>Deleting Post...</div>}
                      {deletePostError && <div>Error deleting Post!</div>}
                    </Dialog>
                  )}
                </div>,
              ]
            ) : (
              <MenuItem onClick={handleReportClick}>Report</MenuItem>
            )}
          </Menu> */}

          {/* new version */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreHorizClose}>
            <div>
              {isCurrentUser && (
                <MenuItem key="modify" onClick={handleModifyClick}>
                  Modify
                </MenuItem>
              )}
              {isCurrentUser && (
                <MenuItem key="delete" onClick={() => handleOpenDialog(postId)}>
                  Delete
                </MenuItem>
              )}
            </div>

            {/* check authentication for user */}
            {!isCurrentUser && <MenuItem onClick={handleReportClick}>Report</MenuItem>}
          </Menu>
        </div>
      </div>
      {dialog !== null && (
        <Dialog
          open={dialog && dialog === postId}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Delete PostId'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete this post ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>CANCEL</Button>
            <MenuItem key="delete" onClick={() => handleDeleteClick(postId)} autoFocus>
              Delete
            </MenuItem>
          </DialogActions>
          {deletePostLoading && <div>Deleting Post...</div>}
          {deletePostError && <div>Error deleting Post!</div>}
        </Dialog>
      )}

      <section>
          <Container sx={{ marginTop: '8px' }}>
            <h2>Comments ({Number(totalComments)})</h2>
          </Container>
          <RegisterComment
            initialText=""
            onSubmit={(comment) => {
              addComment({
                postId: postId,
                data: {
                  postId: postId,
                  username: user.username,
                  comment,
                  user: user.id,
                },
              });
            }}
          />
          {addCommentLoading && <div>Adding comment...</div>}
          {addCommentError && <div>Error adding comment!</div>}

          {fetchCommentsLoading && <div>Loading comments...</div>}
          {fetchCommentsError && <div>Error loading comments!</div>}
          {comments?.map((comment) => {
            return <Comment key={comment?._id} comment={comment} />;
          })}
          <div style={{marginBottom: "72px"}}></div>
      </section>
      {isReportDialogOpen && (
        <CreateReport open={isReportDialogOpen} onClose={handleCloseReportDialog} postId={postId} />
      )}
    </>
  );
};

export default PostDetail;
