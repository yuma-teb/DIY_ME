import { Link } from 'react-router-dom';
import { Grid, Skeleton, Alert } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useFetchAllUsersQuery } from '../../../redux/api/UserApi';
import { useFetchAllProductsQuery } from '../../../redux/api/ProductApi';
import { useFetchAllRefundReturnQuery } from '../../../redux/api/RefundReturnApi';
import { useFetchAllOrdersQuery } from '../../../redux/api/OrderApi';
import { useFetchAllReportsQuery } from '../../../redux/api/ReportApi';
import { useFetchAllShopsQuery } from '../../../redux/api/ShopApi';
import { useFetchAllCategoriesQuery } from '../../../redux/api/CategoryApi';
import { useFetchRequestingProductsQuery } from '../../../redux/api/ProductApi';

import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReplayIcon from '@mui/icons-material/Replay';
import FlagIcon from '@mui/icons-material/Flag';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';

import CardSummary from '../../../components/admin/Dashboard/CardSummary';
import AnimatedNumber from '../../../components/admin/Common/AnimatedNumber';
import Header from '../../../components/admin/Common/Header';

const textDecoration = {
  textDecoration: 'none',
};

const DashBoardPage = () => {
  const chartRef = useRef(null);

  // Fetch all users using the useFetchAllUsersQuery hook
  const {
    data: allUsersData,
    error: usersError,
    isLoading: usersLoading,
  } = useFetchAllUsersQuery();
  const totalUsers = allUsersData ? allUsersData.results : 0;

  // Fetch all products using the useFetchAllProductsQuery hook
  const {
    data: allProductsData,
    error: productsError,
    isLoading: productsLoading,
  } = useFetchAllProductsQuery();
  const totalProducts = allProductsData ? allProductsData.data.products.length : 0;

  // Fetch all return/refund data using the useFetchAllReturnRefundQuery hook
  const {
    data: allRefundReturnData,
    error: refundReturnError,
    isLoading: refundReturnLoading,
  } = useFetchAllRefundReturnQuery();
  console.log('@@@@@@@@@@@@@@@', allRefundReturnData);
  const totalRefundReturn = allRefundReturnData ? allRefundReturnData?.results : 0;

  // Fetch all orders data using the useFetchAllOrdersQuery hook
  const {
    data: allOrdersData,
    error: ordersError,
    isLoading: ordersLoading,
  } = useFetchAllOrdersQuery();
  const totalOrders = allOrdersData ? allOrdersData.results : 0;

  // Fetch all reports using the useFetchAllReportsQuery hook
  const {
    data: allReportsData,
    error: reportsError,
    isLoading: reportsLoading,
  } = useFetchAllReportsQuery();
  const totalReports = allReportsData ? allReportsData.data.reports.length : 0;

  // Fetch all shops using the useFetchAllShopsQuery hook
  const {
    data: allShopsData,
    error: shopsError,
    isLoading: shopsLoading,
  } = useFetchAllShopsQuery();
  const totalShops = allShopsData ? allShopsData.data.docs.length : 0;

  // Fetch all categories using the useFetchAllCategoriesQuery hook
  const {
    data: allProductRequest,
    error: allProductRequestError,
    isLoading: allProductRequestLoading,
  } = useFetchRequestingProductsQuery();
  const totalProductRequest = allProductRequest ? allProductRequest.result : 0;

  const {
    data: allCategoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useFetchAllCategoriesQuery();
  const totalCategories = allCategoriesData ? allCategoriesData.data.docs.length : 0;

  useEffect(() => {
    // Chart initialization code
    if (chartRef.current) {
      const chartData = {
        labels: [
          'Total Products',
          'Categories',
          'Product Requests',
          'Total Orders',
          'Total Users',
          'Total Shops',
          'Refund / Return',
          'Total Reports',
        ],
        datasets: [
          {
            data: [
              totalProducts,
              totalCategories,
              3,
              totalOrders,
              totalUsers,
              totalShops,
              totalRefundReturn,
              totalReports,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 140, 280, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(201, 203, 207, 0.6)',
            ],
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
      };

      const ctx = chartRef.current.getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: chartOptions,
      });

      // Cleanup code
      return () => {
        // Destroy the existing Chart instance
        if (myChart) {
          myChart.destroy();
        }
      };
    }
  }, [totalProducts, totalUsers, totalRefundReturn, totalOrders, totalReports, totalShops]);

  if (
    usersLoading ||
    productsLoading ||
    refundReturnLoading ||
    ordersLoading ||
    reportsLoading ||
    shopsLoading ||
    categoriesLoading
  ) {
    return (
      <Grid sx={{ marginTop: 1 }} container spacing={5} className="j-center itemcenter">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Grid item key={item}>
            <Skeleton variant="rectangular" width={280} height={150} animation="wave" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (
    usersError &&
    productsError &&
    refundReturnError &&
    ordersError &&
    reportsError &&
    shopsError &&
    categoriesError
  ) {
    return <Alert severity="error">Error loading all datas!</Alert>;
  }

  return (
    <>
      <Grid sx={{ marginTop: '32px' }} container spacing={5} className="j-center itemcenter">
        <Grid item>
          <Link to="/admin/products" style={textDecoration}>
            <CardSummary
              title="Total Products"
              value={<AnimatedNumber value={totalProducts} />}
              icon={<StoreIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link
            to="/admin/products/categories"
            style={{
              textDecoration: 'none',
            }}
          >
            <CardSummary
              title="Categories"
              value={<AnimatedNumber value={totalCategories} />}
              icon={<CategoryIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/products/requesting" style={textDecoration}>
            <CardSummary
              title="Product Requests"
              value={<span>{totalProductRequest}</span>}
              icon={<AddBusinessIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/orders" style={textDecoration}>
            <CardSummary
              title="Total Orders"
              value={<AnimatedNumber value={totalOrders} />}
              icon={<AssignmentIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/users" style={textDecoration}>
            <CardSummary
              title="Total Users"
              value={<AnimatedNumber value={totalUsers} />}
              icon={<PeopleIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/shops" style={textDecoration}>
            <CardSummary
              title="Total Shops"
              value={<AnimatedNumber value={totalShops} />}
              icon={<BusinessIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/returnrefund" style={textDecoration}>
            <CardSummary
              title="Refund / Return"
              value={<AnimatedNumber value={totalRefundReturn} />}
              icon={<ReplayIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/admin/reports" style={textDecoration}>
            <CardSummary
              title="Total Reports"
              value={<AnimatedNumber value={totalReports} />}
              icon={<FlagIcon />}
            />
          </Link>
        </Grid>
        <Grid item xs={12}>
          <canvas ref={chartRef}></canvas>
        </Grid>
      </Grid>
    </>
  );
};

export default DashBoardPage;
