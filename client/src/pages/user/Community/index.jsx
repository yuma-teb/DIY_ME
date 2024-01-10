import { displayName } from 'react-quill';
import TabsVariants from '../../../components/user/Community/FilterTab';
import RecipeReviewCard from '../../../components/user/Community/PostCard';
import { Box, Typography, Container } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const CommunityPost = () => {
  return (
    <>
      <Container fixed>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 3
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
          <TabsVariants />
        </Box>
        <Box>
          <RecipeReviewCard />
        </Box>
      </Container>
    </>
  );
};

export default CommunityPost;
