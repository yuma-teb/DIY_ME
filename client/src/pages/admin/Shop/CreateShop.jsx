import { useEffect, useState } from 'react';
import './shop.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateShopMutation } from '../../../redux/api/ShopApi';
import { useFetchShopCandidateQuery } from '../../../redux/api/UserApi';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
const paperWithQuill = {
  height: '470px',
};

const CreateShop = () => {
  const [createShop, { isLoading: addShopLoading, isError: addShopError }] =
    useCreateShopMutation();
  const {
    data: shopCandidate,
    isError: shopError,
    isLoading: shopLoading,
  } = useFetchShopCandidateQuery();
  console.log('@@ SHOP @@', shopCandidate?.data?.shopsOwner);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner:
      shopCandidate?.data?.shopsOwner?.length > 0 ? shopCandidate?.data?.shopsOwner[0]?.id : '',
  });

  if (formData) {
    console.log(formData);
  }
  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files[0] : e.target.value;

    if (type === 'file') {
      console.log('Files:', value);
      setFormData((prevShop) => ({
        ...prevShop,
        updatedConver: value,
      }));
      console.log(formData);
    } else {
      console.log('Non-file value:', value);
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const formDataWithImage = new FormData();
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('phonenumber', formData.phonenumber);
    formDataWithImage.append('description', formData.description);
    formDataWithImage.append('email', formData.email);
    formDataWithImage.append('image', formData.updatedConver);
    formDataWithImage.append('address', formData.addresss);
    console.log(formDataWithImage.get('name'));
    const res = await createShop(formDataWithImage);
    console.log('RES', res);
    if (res.data.status === 'success') {
      navigate('/admin/shops');
    }
  };
  return (
    <Container>
      <h1>{formData.id}</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography typography="h1">Create Shop</Typography>
        </div>
        <Grid container className="space-grid">
          <Grid item xs={9}>
            <Paper className="paper-layout" style={paperWithQuill}>
              <Typography typography="h2">General information</Typography>
              {/* <div className="space-content">
                  <img src={formData.shopCover} className="shop-cover" alt="" />
                </div> */}
              <div className="d-flex j-center">
                <div>
                  {formData.updatedConver && (
                    <img
                      src={URL.createObjectURL(formData.updatedConver)}
                      alt="Preview"
                      className="height-350"
                    />
                  )}
                </div>

                <div></div>
              </div>

              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="Shop Name"
                  variant="outlined"
                  className="product-name-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="Shop Description"
                  variant="outlined"
                  className="product-name-input"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  className="product-name-input"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="email"
                  variant="outlined"
                  className="product-name-input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="address"
                  variant="outlined"
                  className="product-name-input"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </Paper>
          </Grid>
          <div className="space-content">
            <Button variant="contained" component="label">
              Upload image
              <input type="file" name="image" hidden onChange={handleChange} required />
            </Button>
          </div>
        </Grid>

        <div className="d-flex flex-end itemcenter header-space">
          <div className="d-flex j-spacebtw itemcenter btn-product">
            <Link to="/products">
              <Button variant="outlined" color="nonAction">
                cancel
              </Button>
            </Link>
            <Button variant="contained" color="view" type="submit">
              Create Shop
            </Button>
            {addShopLoading && <div>Adding shop...</div>}
            {addShopError && <div>Error adding shop!</div>}
          </div>
        </div>
      </form>
    </Container>
  );
};

export default CreateShop;
