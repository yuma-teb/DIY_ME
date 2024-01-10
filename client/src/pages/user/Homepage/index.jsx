import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/user/ProductCard';
import IdeaCard from '../../../components/user/IdeaCard';
import CategoryCard from '../../../components/user/CategoryCard';
import { Container, Typography, Button, Grid, IconButton, Card } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { useFetch4CategoriesQuery } from '../../../redux/api/CategoryApi';
import { useFetch4PopularProductsQuery } from '../../../redux/api/ProductApi';

const iconStyle = {
  width: '48px',
  height: '48px',
  margin: '24px 0 12px 0',
};

const sectionStyle = {
  margin: '0 0 12px 0',
  letterSpacing: '0.3px',
};

const subSectionStyle = {
  margin: '0 0 32px 0',
  letterSpacing: '0.3px',
  color: '#808080',
};

const textSpace = {
  margin: '0 0 20px 0',
  letterSpacing: '0.3px',
};

const ideaCards = [
  {
    link: 'https://www.youtube.com/watch?v=vH9EUTvA5tA',
    image:
      'https://woodshop-diaries.myshopify.com/cdn/shop/files/ModernBookshelfFrontPage_590x.jpg?v=1688665218',
    title: 'How to Build a Bookshelf',
    description: 'Learn step-by-step instruction for creating your own bookshelf.',
  },
  {
    link: 'https://www.youtube.com/watch?v=2rhZ7lzaU4Y',
    image:
      'https://i.ytimg.com/vi/0Yacj2MOzbU/maxresdefault.jpg',
    title: '4 Easy Candle Making tutorial',
    description: 'candle making tutorial diy candle making for beginners art and craft',
  },
];

function HomePage() {
  // fetch category data
  const {
    data: dataCategories,
    error: fetchCategoriesError,
    isLoading: fetchCategoriesLoading,
  } = useFetch4CategoriesQuery();
  const categories = dataCategories?.data?.docs;
  console.log(categories)

  const {
    data: dataProducts,
    error: fetchProductsError,
    isLoading: fetchProductsLoading,
  } = useFetch4PopularProductsQuery();
  const products = dataProducts?.data?.products;
  console.log(products)

  // error handle for category
  if (fetchCategoriesLoading) {
    return <div>Loading categories data...</div>;
  }

  if (fetchCategoriesError) {
    return <Alert severity="error">Error loading categories!</Alert>;
  }

  // error handle for product
  if (fetchProductsLoading) {
    return <div>Loading products data...</div>;
  }

  if (fetchProductsError) {
    return <div>Error loading products data!</div>;
  }
  return (
    <>
      <div className="hero-section">
        <img
          src="https://ecommececeo.b-cdn.net/wp-content/uploads/2018/11/Crafts-To-Make-and-Sell2.jpg"
          alt=""
          className="hero-img"
        />
        <Container className="hero-container">
          <Typography
            typography={'title'}
            sx={{ margin: '0 0 16px 0', letterSpacing: '1px', lineHeight: '36px' }}
          >
            Discover the DIY Product You Needs
          </Typography>
          <Typography
            typography={'text'}
            sx={{ margin: '0 0 16px 0', letterSpacing: '0.3px', width: '306px' }}
          >
            Shop our wide selection of DIY materials and get inspired to create something amazing
          </Typography>
          <Link to={'/products'}>
            <Button variant="contained" color="primary">
              Shop Now
            </Button>
          </Link>
        </Container>
      </div>

      <Container>
        <StorefrontIcon style={iconStyle} />
        <Typography typography={'section'} style={sectionStyle}>
          Browse Our Extensive Collection of Materials
        </Typography>
        <Typography typography={'text'} style={subSectionStyle}>
          Explore what you need for your DIY projects. we’ve got you covered.
        </Typography>
        <Typography typography={'section'} textAlign={'center'} style={textSpace}>
          Recommend Categories
        </Typography>
        <Grid container spacing={1.2}>
          {categories.map((category, i) => {
            return <CategoryCard key={category.id} name={category.name} img={category.imageLink} />;
          })}
        </Grid>

        <Typography typography={'section'} textAlign={'center'} style={textSpace}>
          Popular Product
        </Typography>
        <Grid container spacing={1.2}>
          {products.map((product) => {
            return (
              <ProductCard
                key={product._id}
                productId={product._id}
                img={product.imagesLink[0]}
                price={product.price}
                name={product.name}
                rating={product.ratingAverage}
                sold={product.sold}
              />
            );
          })}
        </Grid>
        <div className="d-flex button-text">
          <Link to={'/products'}>
            <IconButton size="small">
              See More
              <ArrowForwardIcon />
            </IconButton>
          </Link>
        </div>

        <TipsAndUpdatesOutlinedIcon style={iconStyle} />
        <Typography typography={'section'} style={sectionStyle}>
          Get inspired by our DIY Project Ideas
        </Typography>
        <Typography typography={'text'} style={subSectionStyle}>
          Check out our collection of DIY project ideas that will spark your imagination and help
          you create something amazing.
        </Typography>
        <Grid container spacing={2}>
          {ideaCards.map((ideaCard, index) => (
            <Grid item xs={12}  key={index}>
              <IdeaCard
                link={ideaCard.link}
                image={ideaCard.image}
                title={ideaCard.title}
                description={ideaCard.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <div className="community-section">
        <Container sx={{ padding: '20px 16px' }}>
          <Typography typography={'title'}>What is DIY Material?</Typography>
          <Typography typography={'text'}>
            We offer a wide range of materials and DIY products to help you bring your creative
            ideas to life. Whether you’re a seasoned DIY or just starting out, our high-quality
            materials and step-by-step guides will make your projects a success.
          </Typography>
          <Typography typography={'title'}>Our Community</Typography>
          <Typography typography={'text'}>
            Our community is a vibrant hub where creativity meets camaraderie. Whether you're a
            seasoned DIY pro or taking your first plunge into the world of crafting, our community
            is a welcoming space for all.
          </Typography>
          <img
            src="https://img.freepik.com/free-vector/digital-marketing-team-with-laptops-light-bulb-marketing-team-metrics-marketing-team-lead-responsibilities-concept_335657-258.jpg?w=996&t=st=1702648060~exp=1702648660~hmac=88ddd089d6055f3eb686fe08bc725475ff3b079ba4e107c0584c955f546ffdd7"
            alt="community-image"
            className="community-image"
          />
          <div className="d-flex button-text">
            <Link to='/community'>
            <IconButton size="small">
              Community
              <ArrowForwardIcon />
            </IconButton>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}

export default HomePage;
