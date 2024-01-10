import React, { useState, useEffect } from 'react';
import { FormControl, OutlinedInput, InputAdornment, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useUpdateCommentMutation } from '../../../redux/api/CommentsApi';


const RegisterComment = ({ initialText, onSubmit, updateComment, dataComment }) => {
  const [comment, setComment] = useState(initialText || dataComment?.comment || '');
  console.log(dataComment);
  const [editComment, { isLoading: editCommentLoading, isError: editCommentError }] =
    useUpdateCommentMutation() || {};
   
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSendClick = () => {
    if (comment.trim() !== '' && comment !== initialText) {
      const commentWithoutUsername = initialText ? comment.replace(initialText, '') : comment;

      onSubmit(commentWithoutUsername.trim());
      setComment('');
    }
  };
  const handleUpdatedComment = async () => {
    const data = {
      ...dataComment,
      comment: comment,
    };
    const res = await editComment(data);
    setComment('')
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendClick();
    }
  };

  return (
    <FormControl
      fullWidth
      variant="outlined"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 1,
      }}
    >
      <OutlinedInput
        // multiline
        // rows={2}
        placeholder="Enter the content..."
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={handleKeyPress}
        endAdornment={
          <InputAdornment position="end">
            <Button
              onClick={dataComment ? handleUpdatedComment : handleSendClick}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default RegisterComment;
