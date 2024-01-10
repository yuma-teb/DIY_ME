import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Dialog,
  AppBar,
  ListItemText,
  ListItem,
  List,
  Divider,
  Toolbar,
  Slide,
  Checkbox,
  Container,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch } from 'react-redux';
import { openOverlay } from '../../../redux/slices/VariationOverlaySlice';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VariationOverlay = ({ openOverlayVariation, variations, productId, variationImg }) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(openOverlay());
  };
  const [qty, setQty] = useState(0);
  useEffect(() => {
    setSelectedVariationId({
      ...selectedVariationId,
      qty: qty,
    });
  }, [qty]);

  const [selectedVariationId, setSelectedVariationId] = useState({ qty: 1 });

  const handleClick = (index) => {
    console.log(index);
    if (selectedVariationId !== null) {
      setQty(1);
    }
    setSelectedVariationId({
      ...selectedVariationId,
      selectedVariation: variations[index],
      qty: qty,
      selectedVariationIndex: index,
      productId: productId,
      selectedVariationImg: variationImg,
    });
  };

  const handleIncQty = () => {
    setQty(qty + 1);
  };

  const hanldeDecQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedVariationId({ ...selectedVariationId, qty: qty });
    console.log(selectedVariationId);
  };

  return (
    <>
      <form>
        <Dialog
          fullScreen
          open={openOverlayVariation}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Variations
              </Typography>
              <Button color="inherit" onClick={handleSubmit}>
                Add To Cart
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            {variations.map((variation, index) => {
              return (
                <ListItem key={index} onClick={() => handleClick(index)}>
                  <Checkbox checked={selectedVariationId.selectedVariationIndex === index} />
                  <ListItemText primary={variation.name} secondary={variation.attribute} />
                  <Typography sx={{ fontSize: '16px', color: '#F6555F' }}>
                    ${variation.price}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
          <div className="cart-item-qty">
            <Typography typography={'text'}>
              Total Quantity :
              <IconButton onClick={hanldeDecQty}>{<RemoveCircleOutlineIcon />}</IconButton>
              {qty}
              <IconButton onClick={handleIncQty}>{<AddCircleOutlineIcon />}</IconButton>
            </Typography>
          </div>
        </Dialog>
      </form>
    </>
  );
};

export default VariationOverlay;
