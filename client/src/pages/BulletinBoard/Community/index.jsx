import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PostCard from '../../../components/BulletinBoard/PostCard';
import { useFetchPostsQuery } from '../../../redux/api/PostsApi';
import { Box, Typography, Container, Fab, Alert, Tabs, Tab } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import TabsVariants from '../../../components/user/Community/FilterTab';
import RecipeReviewCard from '../../../components/user/Community/PostCard';
import { useSelector } from 'react-redux';
import AllPost from './AllPost';
import MyPost from './MyPost';

const Community = () => {
  // const { data, error: fetchPostsError, isLoading: fetchPostsLoading } = useFetchPostsQuery() || {};
  // const posts = data?.data?.posts;
  const [value, setValue] = useState(0);

  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);

  // console.log('dg', user._id);

  // Ensure that posts are sorted in descending order by createdAt
  // const sortedPosts = posts?.data?.posts
  // ?.filter((post) => post?.createdAt) // Filter out posts without a valid createdAt
  // .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // if (fetchPostsLoading) {
  //   return <div>Loading posts data...</div>;
  // }

  // if (fetchPostsError) {
  //   return <Alert severity="error">Error loading posts data!</Alert>;
  // }
  console.log('hiiii', value);
  return (
    <div>
      <Container fixed>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <LanguageIcon sx={{ fontSize: '30px' }} />
            <Typography variant="h2" sx={{ letterSpacing: '0.5px' }}>
              Community
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="All Post" sx={{ width: '50%' }} />
            {user?._id && <Tab variant="filled" label="My Post" sx={{ width: '50%' }} />}

          </Tabs>
        </Box>
        {value === 0 ? <AllPost /> : <MyPost userId={user._id}/>}
      </Container>
    </div>
  );
};

export default Community;
