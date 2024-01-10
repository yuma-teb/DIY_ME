import React from 'react';
import { Link } from 'react-router-dom';
import { Fab, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PostCard from '../../../components/BulletinBoard/PostCard';
import { useFetchPostsQuery } from '../../../redux/api/PostsApi';
import { Box, Typography, Container } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import TabsVariants from '../../../components/user/Community/FilterTab';
import RecipeReviewCard from '../../../components/user/Community/PostCard';

const AllPost = () => {
  const { data, error: fetchPostsError, isLoading: fetchPostsLoading } = useFetchPostsQuery() || {};
  const posts = data?.data?.posts;
  console.log(posts);


  // Ensure that posts are sorted in descending order by createdAt
  // const sortedPosts = posts?.data?.posts
  // ?.filter((post) => post?.createdAt) // Filter out posts without a valid createdAt
  // .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (fetchPostsLoading) {
    return <div>Loading posts data...</div>;
  }

  if (fetchPostsError) {
    return <Alert severity="error">Error loading posts data!</Alert>;
  }

  return (
    <div>
      {posts?.length === 0 ? (
        <p>No Any Posts yet, Please adding posts</p>
      ) : (
        posts?.map((post) => <PostCard key={post?._id} post={post} />)
      )}
      <Link to="/community/create-post">
        <Fab
          color="secondary"
          aria-label="edit"
          style={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <EditIcon />
        </Fab>
      </Link>
      <div className='space-footer'> </div>
    </div>
  );
};

export default AllPost;
