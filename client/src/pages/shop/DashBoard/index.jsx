import { Link } from 'react-router-dom';
import { Grid, Skeleton, Alert } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useFetchAllUsersQuery } from '../../../redux/api/UserApi';
import { useFetchShopProductsQuery } from '../../../redux/api/ProductApi';
import { useFetchShopRefundReturnQuery } from '../../../redux/api/RefundReturnApi';
import { useFetchShopOrdersQuery } from '../../../redux/api/OrderApi';

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

// console.log('id', user?.shop);
const DashBoardShop = () => {
  const chartRef = useRef(null);
  let user = JSON.parse(localStorage.getItem('user'));

  console.log('User', user);
  // Fetch all products using the useFetchAllProductsQuery hook
  const {
    data: allProductsData,
    error: productsError,
    isLoading: productsLoading,
  } = useFetchShopProductsQuery(user?.shop);

  console.log(allProductsData?.data?.products?.length);
  const totalProducts = allProductsData ? allProductsData.data.products.length : 0;

  // Fetch all return/refund data using the useFetchAllReturnRefundQuery hook
  const {
    data: allRefundReturnData,
    error: refundReturnError,
    isLoading: refundReturnLoading,
  } = useFetchShopRefundReturnQuery(user.shop);
  console.log('@@@@@@@@@@@@@@@', allRefundReturnData);
  const totalRefundReturn = allRefundReturnData ? allRefundReturnData?.results : 0;

  // Fetch all orders data using the useFetchAllOrdersQuery hook
  const {
    data: allOrdersData,
    error: ordersError,
    isLoading: ordersLoading,
  } = useFetchShopOrdersQuery(user.shop);
  const totalOrders = allOrdersData ? allOrdersData.results : 0;

  useEffect(() => {
    // Chart initialization code
    if (chartRef.current) {
      const chartData = {
        labels: ['Total Products', 'Total Orders', 'Refund / Return'],
        datasets: [
          {
            data: [totalProducts, totalOrders, totalRefundReturn],
            backgroundColor: [
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
  }, [totalProducts, totalRefundReturn, totalOrders]);

  if (productsLoading || refundReturnLoading || ordersLoading) {
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

  if (productsError && refundReturnError) {
    return <Alert severity="error">Error loading all datas!</Alert>;
  }

  return (
    <>
      <Grid sx={{ marginTop: 1 }} container spacing={5} className="j-center itemcenter">
        <Grid item>
          <Link to="/shop/product" style={textDecoration}>
            <CardSummary
              title="Total Products"
              value={<AnimatedNumber value={totalProducts} />}
              icon={<StoreIcon />}
            />
          </Link>
        </Grid>
        <Grid item>
          <Link to="/admin/product-requests" style={textDecoration}>
            <CardSummary
              title="Product Requests"
              value={<span>3</span>}
              icon={<AddBusinessIcon />}
            />
          </Link>
        </Grid>
        <Grid item>
          <Link to="/shop/orders" style={textDecoration}>
            <CardSummary
              title="Total Orders"
              value={<AnimatedNumber value={totalOrders} />}
              icon={<AssignmentIcon />}
            />
          </Link>
        </Grid>

        <Grid item>
          <Link to="/shop/returnrefund" style={textDecoration}>
            <CardSummary
              title="Refund / Return"
              value={<AnimatedNumber value={totalRefundReturn} />}
              icon={<ReplayIcon />}
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

export default DashBoardShop;
