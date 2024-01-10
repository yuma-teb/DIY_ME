import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const productApi = createApi({
  reducerPath: 'products',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetch4PopularProducts: builder.query({
        providesTags: ['UserProduct'],
        query: () => {
          return {
            url: '/product?sort=-sold&limit=4',
            method: 'GET',
          };
        },
      }),
      fetchProductByName: builder.query({
        query: (searchTerm) => ({
          url: `/product/search/${searchTerm}`,
          method: 'GET',
        }),
      }),
      editProductById: builder.mutation({
        invalidatesTags: ['Product'],
        query: (updateProduct) => {
          console.log('Query ID', updateProduct.get('category'));
          return {
            url: `/product/${updateProduct.get('id')}`,
            method: 'PATCH',
            body: updateProduct,
          };
        },
      }),
      editRequestById: builder.mutation({
        invalidatesTags: ['Product'],
        query: (data) => {
          console.log(data);
          return {
            url: `/product/${data.id}/request`,
            method: 'PATCH',
            body: data,
          };
        },
      }),
      deleteProductById: builder.mutation({
        query: (id) => ({
          url: `/product/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Product', id }],
      }),
      fetchAllProducts: builder.query({
        providesTags: ['Product'],
        query: () => {
          return {
            url: '/product',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          };
        },
      }),
      addProduct: builder.mutation({
        invalidatesTags: ['Product'],
        query: (newProduct) => {
          return {
            url: '/product',
            method: 'POST',
            body: newProduct,
          };
        },
      }),
      fetchProductById: builder.query({
        providesTags: (result, error, id) => [{ type: 'Product', id }],
        query: (id) => {
          console.log(id);
          return {
            url: `/product/${id}`,
            method: 'GET',
          };
        },
      }),
      fetchShopProducts: builder.query({
        providesTags: ['Product'],
        query: (id) => {
          return {
            url: `product?shop=${id}`,
            method: 'GET',
          };
        },
      }),
      fetchRequestingProducts: builder.query({
        providesTags: ['Product'],
        query: () => {
          return {
            url: '/product?isActive=false',
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const {
  useFetchAllProductsQuery,
  useAddProductMutation,
  useFetchProductByIdQuery,
  useDeleteProductByIdMutation,
  useEditProductByIdMutation,
  useFetch4PopularProductsQuery,
  useFetchProductByNameQuery,
  useFetchShopProductsQuery,
  useFetchRequestingProductsQuery,
  useEditRequestByIdMutation,
} = productApi;
export { productApi };
