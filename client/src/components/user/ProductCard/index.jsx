import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Grid, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

function ProductCard({ price, name, rating, sold, img, productId }) {
  const navigator = useNavigate()
  const handleOpenDetail = () => {
    navigator(`/products/${productId}`);
  };
  const ratingAvg = parseFloat(rating).toFixed(1)
  return (
    <>
      <Grid item xs={6}>
        <div onClick={handleOpenDetail}>
          <Card sx={{ width: '167px', height: '233px' }}>
            <img src={img} alt="" className="product-card-img" />
            <Typography
              typography={'section'}
              sx={{ margin: '0 8px 0 8px', letterSpacing: '0.3px', color: '#F6555F' }}
            >
              $ {price}
            </Typography>
            <Typography
              typography={'text'}
              sx={{
                margin: '0 8px 0px 8px ',
                letterSpacing: '0.3px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </Typography>
            <div className="d-flex ">
              <StarIcon
                sx={{ margin: '0 0px 0px 6px ', color: '#FFC700', width: '16px', height: '20px' }}
              />
              <Typography
                sx={{
                  margin: '0 8px 0px 0px ',
                  letterSpacing: '0.3px',
                  color: '#808080',
                  fontSize: '14px',
                }}
              >
                {ratingAvg}
              </Typography>
              <LocalMallOutlinedIcon
                sx={{ margin: '0 0px 0px 4px ', color: '#808080', width: '16px', height: '20px' }}
              />
              <Typography
                sx={{
                  margin: '0 8px 0px 0px ',
                  letterSpacing: '0.3px',
                  color: '#808080',
                  fontSize: '14px',
                }}
              >
                {sold}
              </Typography>
            </div>
          </Card>
        </div>
      </Grid>
    </>
  );
}

export default ProductCard;
