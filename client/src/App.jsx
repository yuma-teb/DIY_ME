import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Link, Outlet } from 'react-router-dom';
import Layout from './pages/admin/Layout';
import UserLayout from './pages/user/UserLayout';
import DashBoard from './pages/admin/DashBoard';
import OrderLists from './pages/admin/Orders';
import Reports from './pages/admin/Reports';
import AddProductPage from './pages/admin/Products/AddProduct';
import { Card, Checkbox, TextField, ThemeProvider } from '@mui/material';
import { theme } from './components/admin/Theme';
import Button from './components/admin/Button';
import Search from './components/admin/SearchBar';
import CardComp from './components/admin/CardStatistic';
import TableList from './components/admin/TableList';
import Category from '../src/pages/admin/Category/Index';
import AddCategory from './pages/admin/Category/AddCategory';
import CategoryDetail from './pages/admin/Category/CategoryDetail';
import EditCategory from './pages/admin/Category/EditCategory';
import Modal from './components/admin/Modal';
import CheckBox from './components/admin/Checkbox';
import TextFieldComp from './components/admin/TextField';
import OrderPage from './pages/admin/Orders';
import OrderDetail from './pages/admin/Orders/OrderDetail';
import Login from '../src/auth/Login';
import RequireAuth from './auth/isAuthorized';
import { Collapse } from '@mui/material';
import Shop from '../src/pages/admin/Shop';
import ShopDetail from './pages/admin/Shop/ShopDetail';
import EditShop from './pages/admin/Shop/EditShop';
import ProductDetail from './pages/admin/Products/ProductDetail';
import ProductListsPage from './pages/admin/Products';
import EditProduct from './pages/admin/Products/EditProduct';
import ReturnRefundPage from './pages/admin/ReturnRefund/index';
import ReturnRefundDetail from './pages/admin/ReturnRefund/ReturnRefundDetail';
import UsersList from './pages/admin/Users';
import UserDetail from './pages/admin/Users/UserDetail';
import Profile from './pages/admin/Profile';
import ResetPassword from '../src/auth/ResetPassword';
import CheckingEmailTemplate from './auth/ResetPassword/CheckingEmail';
import UpdateForgetPassword from './auth/ResetPassword/UpdateForgetPassword';
import CreateShop from './pages/admin/Shop/CreateShop';
import SignUp from './auth/SignUp';
import ProductReqeusting from './pages/admin/Products/ProductRequest';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentToken,
  setCredentials,
  logOut,
  selectCurrentUser,
} from './redux/slices/AuthSlice';
////////////////////// Shop //////////////////////
import DashBoardShop from './pages/shop/DashBoard';
////////////////////// user page //////////////////////
import HomePage from './pages/user/Homepage';
import ProductList from './pages/user/ProductList';
import UserProductDetail from './pages/user/ProductList/UserProductDetail';
import UserSearchProduct from './pages/user/ProductList/UserSearchProduct';
import UserShopDetail from './pages/shop/UserShopDetail';
import ProductReview from './pages/user/ProductList/ProductReview';

import Community from './pages/BulletinBoard/Community';
import CreatePost from './pages/BulletinBoard/Community/CeatePost';
import PostDetail from './pages/BulletinBoard/Community/PostDetail';
import CreateReport from './pages/BulletinBoard/Community/CreateReport';

import Cart from './pages/user/Cart';
import Order from './pages/user/Orders';
import ShippingAddress from './pages/user/Orders/ShippingAddress';
import PaymentMethod from './pages/user/Payment/PaymentMethod';
import SuccessStatus from './pages/user/Payment/SucessStatus';
import OrderHistory from './pages/user/Orders/UserOrderHistory';

////////////////////// Community Page ///////////////////
import CommunityPost from './pages/user/Community';
import EditPost from './pages/BulletinBoard/Community/EditPost';
import UserProfile from './pages/user/Profile';
////////////////////// Shop Page ///////////////////
import ShopProduct from './pages/shop/Product';
import { Roles } from './helpers/Roles';
import PrivateRoute from './helpers/PrivateRoute';
import NotFoundPage from './helpers/NoteFound';
import ShopLayout from './pages/shop/Layout';
// import Order from './pages/shop/Order';
import ReturnRefund from './pages/shop/ReturnRefund';

function App() {
  const [count, setCount] = useState(false);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        {/* ========== Shop ========== */}
        <Route
          path="shop"
          element={
            <PrivateRoute roles={[Roles.Shop]}>
              <ShopLayout />{' '}
            </PrivateRoute>
          }
        >
          <Route index element={<DashBoardShop />} />
          <Route path="product">
            <Route index element={<ShopProduct />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path=":id/edit" element={<EditProduct />} />
            <Route path="addproduct" element={<AddProductPage />} />
          </Route>
          {/* <Route path="orders">
            <Route index element={<Order />} />
          </Route> */}
          <Route path="returnrefund">
            <Route index element={<ReturnRefund />} />
          </Route>
        </Route>

        {/* ========== admin ========== */}
        <Route
          path="admin"
          element={
            <PrivateRoute roles={[Roles.Admin]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashBoard />} />
          {/* product route */}
          <Route path="products">
            <Route index element={<ProductListsPage />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path=":id/edit" element={<EditProduct />} />
            <Route path="requesting" element={<ProductReqeusting />} />
            <Route path="categories">
              <Route index element={<Category />} />
              <Route path="addcategory" element={<AddCategory />} />
              <Route path=":id" element={<CategoryDetail />} />
              <Route path=":id/edit" element={<EditCategory />} />
            </Route>
          </Route>
          {/* Oder  */}
          <Route path="orders">
            <Route index element={<OrderPage />} />
            <Route path=":id" element={<OrderDetail />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<UserDetail />} />
          </Route>
          {/* shop */}
          <Route path="shops">
            <Route index element={<Shop />} />
            <Route path=":id" element={<ShopDetail />} />
            <Route path="create" element={<CreateShop />} />
            <Route path=":id/edit" element={<EditShop />} />
          </Route>
          {/* Report */}
          <Route path="reports">
            <Route index element={<Reports />} />
          </Route>
          {/* Report */}
          <Route path="returnrefund">
            <Route index element={<ReturnRefundPage />} />
            <Route path=":id" element={<ReturnRefundDetail />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* user page */}

        <Route
          path=""
          element={
            <>
              <UserLayout />
            </>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path=":id" element={<UserProductDetail />} />
            <Route path=":id/shop" element={<UserShopDetail />} />
            <Route path=":id/review" element={<ProductReview />} />
            <Route path="search" element={<UserSearchProduct />} />
          </Route>
          <Route path="cart">
            <Route index element={<Cart />} />
            <Route path="order" element={<Order />} />
            <Route path="order/shippingAddress" element={<ShippingAddress />} />
            <Route path="order/paymentMethod" element={<PaymentMethod />} />
            <Route path="order/paymentMethod/success" element={<SuccessStatus />} />
          </Route>
          <Route path="OrderHistory">
            <Route index element={<PrivateRoute roles={[Roles.User]}><OrderHistory /></PrivateRoute>} />
          </Route>
          <Route path="user/profile" element={<PrivateRoute roles={[Roles.User]}><UserProfile /></PrivateRoute>}/>
          <Route path="community">
            <Route index element={<Community />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path=":postId" element={<PostDetail />} />
            <Route path=":postId/create-report" element={<CreateReport />} />
            <Route path=":postId/:commentId/create-report" element={<CreateReport />} />
            <Route path=":postId/edit" element={<EditPost />} />
          </Route>
        </Route>

        <Route path="/resetPassword">
          <Route index element={<ResetPassword />} />
          <Route path="checkingEmail" element={<CheckingEmailTemplate />} />
          <Route path="updateForgetPassword/:token" element={<UpdateForgetPassword />} />
        </Route>

        <Route path="communityMe">
          <Route index element={<CommunityPost />} />
          {/* <Route path="detail" element={<UserProductDetail />} /> */}
        </Route>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      {/* <Routes> */}
      {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
      {/* <Route
          path="/admin"
          element={
            <RequireAuth>
              <Route path="products">
                <Route index element={<ProductLists />} />
              </Route>
            </RequireAuth>
          }
        /> */}
      {/* <Route path="/admin/products">
            <Route index element={<ProductLists />} />
          </Route>
          <Route path="/admin/product-requests" element={<ProductRequests />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/order-lists" element={<OrderLists />} />
          <Route path="/admin/users">
            <Route index element={<UserLists />} />
          </Route>
          <Route path="/admin/shop-lists" element={<ShopLists />} />

          <Route path="/admin/reports" element={<Reports />} />
        </Route>
        <Route path="shop">
          <Route index element={<Shop />} />
        </Route>

        */}
      {/* <Route
          path="/admin"
          element={
            <>
              <RequireAuth>
                <Route index element={<Dashboard />} />
                <Route path="/products" element={<ProductListsPage />} />
                <Route path="/products/addproduct" element={<AddProductPage />} />
              </RequireAuth>
            </>
          }
        /> */}
      {/* </Routes> */}
      {/* {/* <Modal />
      <Button />
      <CheckBox />
      <Search />
      <CardComp />
      <TextFieldComp label={'label'} value={'Text'} />
      <CardList /> */}{' '}
      {/* <TableList /> */}
    </ThemeProvider>
  );
}
export default App;
