import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
  Container,
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import { useFetchCommentsQuery } from '../../../redux/api/CommentsApi';

const PostCard = ({ post, showFullDescription, isLinkEnabled = true }) => {
  console.log(post);
  let {
    data: commentsData,
    error: fetchCommentsError,
    isLoading: fetchCommentsLoading,
  } = useFetchCommentsQuery(post._id) || {};
  const comment = commentsData?.data?.newcomments || [];
  console.log(comment);

  let totals = comment?.map((item) => item?.replies?.length);

  let totalComments = totals?.reduce((acc, item) => acc + item, 0);

  totalComments = totalComments + comment?.length;

  const {
    _id,
    title,
    description,
    imageLink,
    createdAt,
    likes = 100,
    comments = totalComments,
    username,
  } = post || {};
  console.log('Post', post);

  // const user = { name: 'Admin' };
  // const user = useSelector((state) => state.auth.user);
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Card elevation={1} color="primary" sx={{ marginTop: '12px', backgroundColor: '#DEDEDE' }}>
        <CardHeader
          avatar={<Avatar>{username[0]}</Avatar>}
          title={username}
          subheader={new Date(createdAt).toLocaleDateString()}
        />

        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            component={isLinkEnabled ? Link : 'div'}
            to={isLinkEnabled ? `/community/${_id}` : undefined}
            sx={{ textDecoration: 'none' }}
            variant="body2"
            color="text.secondary"
          >
            {showFullDescription || description.length <= 80 ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: `${description.substring(0, 80)}...` }} />
            )}
          </Typography>
        </CardContent>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {imageLink && (
            <CardMedia component="img" image={imageLink} alt="" sx={{ width: 150, height: 100 }} />
          )}
        </Container>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <IconButton aria-label="like">
              <ThumbUpAltIcon />
              <Typography variant="body2" color="text.secondary">
                {likes}
              </Typography>
            </IconButton>
          </div>
          <div>
            <IconButton
              aria-label="comment"
              component={Link}
              to={`/community/${_id}`}
              sx={{ textDecoration: 'none' }}
            >
              <ModeCommentOutlinedIcon />
              <Typography variant="body2" color="text.secondary">
                {comments}
              </Typography>
            </IconButton>
          </div>
          <div>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </div>
        </CardActions>
      </Card>
    </Container>
  );
};

export default PostCard;
