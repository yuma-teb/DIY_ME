import React, { useState } from 'react';
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
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {useFetchUserByIdQuery} from '../../../redux/store'

const Index = ({ review, image }) => {
  const {
    data: dataUser,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchUserByIdQuery(review?.user);
  const username = dataUser?.data?.doc?.username

  if (fetchUserLoading) {
    return <div>Loading product review...</div>;
  }

  if (fetchUserError) {
    return <Alert severity="error">Error loading product reviews!</Alert>;
  }
  return (
    <Card elevation={1} color="primary" sx={{ backgroundColor: '#DEDEDE', marginBottom: '8px' }}>
      <div className="d-flex itemcenter j-spacebtw">
        <CardHeader
          avatar={<Avatar>{username}</Avatar>}
          title={username}
          subheader={new Date(review.createdAt).toLocaleDateString()}
        />
        <div className="d-flex ">
          <StarIcon
            sx={{ margin: '0 0px 0px 8px ', color: '#FFC700', width: '16px', height: '20px' }}
          />
          <Typography
            sx={{
              margin: '0 8px 0px 0px ',
              letterSpacing: '0.3px',
              color: '#808080',
              fontSize: '14px',
            }}
          >
            {review.rating}
          </Typography>
        </div>
      </div>
      <CardContent>
        <Typography typography={'section'}>{review.title}</Typography>
        <Typography typography={'text'}>
          {review.body.length <= 80 ? (
            <div dangerouslySetInnerHTML={{ __html: review.body }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: `${review.body.substring(0, 80)}...` }} />
          )}
        </Typography>
      </CardContent>
      <Container sx={{ marginBottom: '16px' }}>
        {image && <CardMedia component="img" image={image} alt="" sx={{ width: 80, height: 80 }} />}
      </Container>
    </Card>
  );
};

export default Index;
