import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './comunity.css';
import { useNavigate } from 'react-router-dom';
import { useFetchPostsQuery, useAddPostMutation } from '../../../redux/api/PostsApi';
import ReactQuill from 'react-quill';
import { Container, Typography, TextField, Button } from '@mui/material';
import './post.css';

const CreatePost = () => {
  const navigate = useNavigate();

  const { refetch } = useFetchPostsQuery();

  const [addPost, { isLoading: addPostLoading, isError: addPostError }] =
    useAddPostMutation() || {};

  const [post, setPost] = useState({
    image: '',
    title: '',
    description: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user', user);

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files[0] : e.target.value;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleQuillChange = (content, name) => {
    setPost((prevPost) => ({ ...prevPost, [name]: content }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formDataWithImages = new FormData();

    Object.entries(post).forEach(([key, value]) => {
      if (key !== 'image') {
        formDataWithImages.append(key, value);
      } else {
        formDataWithImages.append('image', post.image);
      }
    });
    formDataWithImages.append('user', user.id);
    formDataWithImages.append('username', user.username);
    addPost(formDataWithImages);
    refetch();
    navigate('/community');
  };

  return (
    <Container>
      <Typography sx={{ textAlign: 'center', margin: '30px 0px' }}>
        Create Post to Community
      </Typography>

      <form onSubmit={submitHandler}>
        <div>
          <TextField
            id="oulined-basic"
            label="Title"
            variant="outlined"
            name="title"
            sx={{ width: '100%', marginBottom: '10px' }}
            value={post.title}
            onChange={handleChange}
            required
          />

          <ReactQuill
            theme="snow"
            value={post.description}
            onChange={(content) => handleQuillChange(content, 'description')}
          />
          <div className="space-content">
            <Button variant="contained" component="label">
              Upload image
              <input type="file" name="image" hidden onChange={handleChange} />
            </Button>
          </div>
          <div className="post-Image-upload">
            {post.image && (
              <img src={URL.createObjectURL(post.image)} alt="Preview" className="post-image" />
            )}
            {!post.image && <Typography typography={'text'}>Image upload will be here</Typography>}
          </div>
          <div className="d-flex itemcenter buttom-app-post">
            <Link to="/community">
              <Button variant="outlined" color="nonAction">
                cancel
              </Button>
            </Link>
            <Button
              variant="contained"
              sx={{ marginRight: '32px', marginLeft: '8px' }}
              type="submit"
            >
              Post
            </Button>
            {addPostLoading && <div>Adding post...</div>}
            {addPostError && <div>Error adding post!</div>}
          </div>
        </div>
      </form>
    </Container>
  );
};

export default CreatePost;
