import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFetchSinglePostQuery, useUpdatePostMutation } from '../../../redux/api/PostsApi';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Container, Typography, TextField, Button } from '@mui/material';
import './comunity.css';
import './post.css';
const EditPost = () => {
  const navigate = useNavigate();

  const { postId } = useParams();
  const {
    data,
    error: fectchPostError,
    isLoading: fetchPostLoading,
  } = useFetchSinglePostQuery(postId) || {};
  const post = data?.data?.post || [];
  console.log(post);
  const user = JSON.parse(localStorage.getItem('user'));

  const [editPost, { isLoading: editPostLoading, isError: editPostError }] =
    useUpdatePostMutation() || {};

  const [postContent, setPostContent] = useState({
    title: '',
    description: '',
    image: '',
    imageLink: '',
  });
  console.log(postContent);
  let newImg = '';

  useEffect(() => {
    const resImg = post?.image || [];
    setPostContent((prevPost) => ({
      ...prevPost,
      title: post?.title ?? '',
      description: post?.description ?? '',
      image: resImg ?? '',
      imageLink: post.imageLink,
    }));
    newImg = postContent.image;
  }, [data, newImg]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(e.target.files);
    console.log(name);

    if (name === 'image') {
      setPostContent((prevPost) => ({
        ...prevPost,
        image: files[0].name,
      }));
    } else {
      setPostContent((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  // const handleChange = (e) => {
  //   const { name, type } = e.target;
  //   const value = type === 'file' ? e.target.files : e.target.value;

  //   if (type === 'file') {
  //     console.log('Added new files:', value);
  //     setPostContent((prevPost) => ({
  //       ...prevPost,
  //       newImage: [...prevPost.newImage, ...value],
  //     }));
  //     console.log('All', post.newImage);
  //   } else {
  //     console.log('Non-file value:', value);
  //     setPostContent({
  //       ...post,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleQuillChange = (content, name) => {
    setPostContent((prevPost) => ({ ...prevPost, [name]: content }));
  };

  console.log(postContent);

  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   const data = {
  //     ...post,
  //     title: postContent.title,
  //     description: postContent.description,
  //     image: postContent.image,
  //   };
  //   console.log(data._id);

  //   const res = await editPost(data);
  //   console.log(res);
  //   navigate('/community');
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', postId);
    formData.append('title', postContent.title);
    formData.append('description', postContent.description);
    formData.append('image', postContent.image);

    try {
      let response = null;
      if (
        formData.get('title') === postContent.title &&
        formData.get('description') === postContent.description &&
        formData.get('image') === postContent.image
      ) {
        response = await editPost(formData);
        console.log('Data is send');
      }

      console.log('API Response:', response);

      if (response.error) {
        console.error('Error updating category:', response.error);
      } else {
        console.log('Category updated successfully!');
        navigate('/community');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const isImageValid = postContent.image instanceof File || postContent.image instanceof Blob;

  if (editPostError) {
    console.error('Error editing post:', editPostError);
  }
  console.log('hiii', postContent.imageLink);

  return (
    <Container>
      <Typography sx={{ textAlign: 'center', margin: '30px 0px' }}>Edit Post</Typography>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="oulined-basic"
            label="Title"
            variant="outlined"
            name="title"
            sx={{ width: '100%', marginBottom: '10px' }}
            value={postContent.title}
            onChange={handleChange}
            required
          />

          <ReactQuill
            theme="snow"
            value={postContent.description}
            onChange={(content) => handleQuillChange(content, 'description')}
          />

          <div className="space-content">
            <Button variant="contained" component="label">
              Upload image
              <input type="file" name="image" hidden onChange={handleChange} />
            </Button>
          </div>
          <div className="post-Image-upload">
            {postContent.imageLink && (
              <img src={post.imageLink} alt="Preview" className="post-image" />
            )}
            {!post.image && <Typography typography={'text'}>Image upload will be here</Typography>}
            {/* {postContent.imageLink} */}
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
            {editPostLoading && <div>Editing post...</div>}
            {editPostError && <div>Error editing post!</div>}
          </div>
        </div>
      </form>
    </Container>
  );
};

export default EditPost;
