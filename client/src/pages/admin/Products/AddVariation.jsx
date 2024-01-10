import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVariation, removeVariation } from '../../../redux/slices/VariationSlice';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { Typography, Button, Grid, Paper, TextField, Card, CardContent, IconButton } from '@mui/material';

const AddVariation = () => {
  const dispatch = useDispatch();
  const [variation, setVariation] = useState({
    name: '',
    attribute: '',
    stock: '',
    price: '',
  });

  const addVariationCard = useSelector((state) => state.variation.addVariationCard);

  const isVariationValid = () => {
    return (
      variation.name.trim() !== '' &&
      variation.attribute.trim() !== '' &&
      variation.stock.trim() !== '' &&
      variation.price.trim() !== ''
    );
  };

  const handleAddVariation = (e) => {
    if (isVariationValid()) {
      dispatch(addVariation({ ...variation }));
      setVariation({ name: '', attribute: '', stock: '', price: '' });
    } else {
      alert('Please fill in all variation fields before adding.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariation((prevVariation) => ({ ...prevVariation, [name]: value }));
  };

  function VariationCard({ id, name, attribute, stock, price }) {
    const dispatch = useDispatch();
    const handleRemoveVariation = () => {
      dispatch(removeVariation(id));
    };
  
    return (
      <Card className="variation-card" style={{ position: 'relative' }}>
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleRemoveVariation}>
          <CancelOutlinedIcon />
        </IconButton>
        <CardContent>
          <div className="d-flex flex-col">
            <label className="card-space">Variation Name: {name}</label>
            <label className="card-space">Atrribute: {attribute}</label>
            <label className="card-space">Stock: {stock}</label>
            <label className="card-space">Price: {price}</label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="d-flex j-spacebtw itemcenter">
        <Typography typography="h2">Variation</Typography>
        <Button variant="contained" color="primary" onClick={handleAddVariation}>
          add
        </Button>
      </div>
      <Grid container className="product-name-input">
        {Array.isArray(addVariationCard) &&
          addVariationCard.map((data, index) => <VariationCard key={index} {...data} />)}
      </Grid>
      <Paper className="paper-layout space-content">
        <p className="space-content">Variation</p>
        <div className="space-content">
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            className="variation-input"
            name="name"
            value={variation.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-content">
          <TextField
            id="outlined-basic"
            label="Attribute"
            variant="outlined"
            className="variation-input"
            name="attribute"
            value={variation.attribute}
            onChange={handleChange}
          />
        </div>
        <div className="space-content">
          <TextField
            id="outlined-basic"
            label="Stock"
            variant="outlined"
            className="variation-input"
            name="stock"
            value={variation.stock}
            onChange={handleChange}
          />
        </div>
        <div className="space-content">
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            className="variation-input"
            name="price"
            value={variation.price}
            onChange={handleChange}
          />
        </div>
      </Paper>
    </>
  );
}

export default AddVariation;
