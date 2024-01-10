import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { usersApi } from './api/UserApi';
import { refundsApi } from './api/RefundApi';
import { productApi } from './api/ProductApi';
import { refundReturnApi } from './api/RefundReturnApi';
import { ordersApi } from './api/OrderApi';
import { reportsApi } from './api/ReportApi';
import { categoryApi } from './api/CategoryApi';
import authReducer from '../redux/slices/AuthSlice';
import { apiAuthSlice } from './api/AuthApi';
import { shopApi } from './api/ShopApi';
import { variationsReducer } from './slices/VariationSlice';
import { postsApi } from './api/PostsApi';
import { commentsApi } from './api/CommentsApi';
import { productReviewApi } from './api/ProductReviewApi';
import { variationOverlayReducer } from './slices/VariationOverlaySlice';
export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [refundReturnApi.reducerPath]: refundReturnApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [apiAuthSlice.reducerPath]: apiAuthSlice.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    // [refundsApi.reducerPath]: refundsApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [refundsApi.reducerPath]: refundsApi.reducer,
    [productReviewApi.reducerPath]: productReviewApi.reducer,
    variation: variationsReducer,
    variationOverlay: variationOverlayReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      usersApi.middleware,
      productApi.middleware,
      refundReturnApi.middleware,
      refundsApi.middleware,
      ordersApi.middleware,
      reportsApi.middleware,
      categoryApi.middleware,
      apiAuthSlice.middleware,
      shopApi.middleware,
      postsApi.middleware,
      commentsApi.middleware,
      productReviewApi.middleware,
      // refundsApi.middleware,
    );
  },
});
setupListeners(store.dispatch);

export {
  useFetchAllUsersQuery,
  useFetchUserByIdQuery,
  useFetchUserQuery,
  useAddUserMutation,
  useRemoveUserMutation,
  useEditUserMutation,
  useEditSelfMutation,
} from './api/UserApi';
export {
  useFetchAllOrdersQuery,
  useFetchOrderByIdQuery,
  useDeleteOrderByIdMutation,
  useUpdateStatusByIdMutation,
} from './api/OrderApi';
export {
  useFetchAllProductsQuery,
  useAddProductMutation,
  useFetchProductByIdQuery,
  useDeleteProductByIdMutation,
  useEditProductByIdMutation,
  useFetch4PopularProductsQuery,
  useFetchProductByNameQuery,
} from './api/ProductApi';
export {
  useFetchAllCategoriesQuery,
  useAddCategoryMutation,
  useFetchCategoryByIdQuery,
  useDeleteCategoryByIdMutation,
  useEditCategoryByIdMutation,
  useFetch4CategoriesQuery,
} from './api/CategoryApi';

export { useFetchAllRefundsQuery, useFetchRefundByIdQuery } from './api/RefundApi';

// export { useFetchAllRefundReturnQuery } from './api/RefundReturnApi';
export { useFetchAllReportsQuery, useAddReportMutation } from './api/ReportApi';
export { useFetchAllShopsQuery } from './api/ShopApi';

export {
  useFetchPostsQuery,
  useAddPostMutation,
  useFetchSinglePostQuery,
  useFetchPostsByIdQuery,
} from './api/PostsApi';
export {
  useFetchCommentsQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useUpdateCommentMutation,
} from './api/CommentsApi';
// export { useFetchAllRefundReturnQuery } from './api/RefundReturnApi';
// export { useFetchAllReportsQuery } from './api/ReportApi';
// export { useFetchAllShopsQuery } from './api/ShopApi';
export {
  useFetchAllRefundReturnQuery,
  useFetchRefundReturnByIdQuery,
  useDeleteRefundReturnByIdMutation,
} from './api/RefundReturnApi';

export {
  useFetchAllProductReviewsQuery,
} from './api/ProductReviewApi'
