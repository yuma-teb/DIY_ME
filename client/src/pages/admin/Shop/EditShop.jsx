import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './shop.css';
import { useEditShopByIdMutation, useFetchShopByIdQuery } from '../../../redux/api/ShopApi';
import { Link, useNavigate } from 'react-router-dom';
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
  Alert,
} from '@mui/material';
const paperWithQuill = {
  height: '470px',
};
const EditShop = () => {
  const { id } = useParams();
  const { data, error: fetchShopError, isLoading: fetchShopLoading } = useFetchShopByIdQuery(id);
  const [editShop, { isLoading: editShopLoading, isError: editShopError }] =
    useEditShopByIdMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log('Data', data?.data?.img);
    if (!fetchShopLoading && !fetchShopError && data?.data) {
      setFormData({
        ...formData,
        id,
        name: data?.data?.shop?.name,
        description: data?.data?.shop?.description,
        email: data?.data?.shop?.email,
        products: data?.data?.shop?.products,
        shopCover: data?.data?.img,
        phonenumber: data?.data?.shop?.phonenumber,
        updatedConver: null,
      });
    }
  }, [data, fetchShopError, fetchShopLoading]);

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
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('phonenumber', formData.phonenumber);
    formDataWithImage.append('description', formData.description);
    formDataWithImage.append('id', id);
    formDataWithImage.append('image', formData.updatedConver);
    console.log(formDataWithImage.get('name'));
    const res = await editShop(formDataWithImage);
    console.log(res);
    navigate('/admin/shops');
  };
  if (fetchShopLoading) {
    return <div>Loading shop data...</div>;
  }
  if (fetchShopError) {
    return <Alert severity="error">Error loading shop data!</Alert>;
  }
  return (
    <Container>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="d-flex j-spacebtw itemcenter header-space">
          <Typography typography="h1">Edit Shop</Typography>
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
                  {formData.updatedConver ? (
                    <img
                      src={URL.createObjectURL(formData.updatedConver)}
                      alt="Preview"
                      className="height-350"
                    />
                  ) : (
                    <img src={data?.data?.img} alt="Preview" className="height-350" />
                  )}
                </div>

                <div></div>
              </div>

              <div className="space-content">
                <TextField
                  id="outlined-basic"
                  label="Product Name"
                  variant="outlined"
                  className="product-name-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  focused={true}
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
                  focused={true}
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
                  focused={true}
                />
              </div>
            </Paper>
            {/* <Paper className="paper-layout">
              <Typography typography="h2">Media</Typography>
              <div className="space-content">
                <Button variant="contained" component="label">
                  Upload image
                  <input type="file" hidden name="image" multiple onChange={handleChange} />
                </Button>
              </div>
              <div className="Image-upload">
                {resImage.map((img, index) => (
                  <img key={index} src={img} alt="Preview" className="height-350 image-space" />
                ))}
              </div>
            </Paper> */}
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
              Save Editing
            </Button>
            {editShopLoading && <div>Editting shop...</div>}
            {editShopError && <div>Error editting shop!</div>}
          </div>
        </div>
      </form>
    </Container>
  );
};

export default EditShop;
