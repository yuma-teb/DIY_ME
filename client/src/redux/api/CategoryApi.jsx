import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const categoryApi = createApi({
  reducerPath: 'categories',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetch4Categories: builder.query({
        providesTags: ['UserCategory'],
        query: () => {
          return {
            url: '/category?limit=4',
            method: 'GET',
          };
        },
      }),
      editCategoryById: builder.mutation({
        invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
        query: (updateCategory) => {
          console.log(updateCategory.get('id'));
          return updateCategory
            ? { url: `/category/${updateCategory.id}`, method: 'PATCH', body: updateCategory }
            : '';
        },
      }),
      deleteCategoryById: builder.mutation({
        query: (id) => ({
          url: `/category/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
      }),
      addCategory: builder.mutation({
        invalidatesTags: ['Category'],
        query: (newCategory) => {
          return {
            url: '/category',
            method: 'POST',
            body: newCategory,
          };
        },
      }),
      fetchCategoryById: builder.query({
        providesTags: (result, error, id) => [{ type: 'Category', id }],
        query: (id) => {
          return {
            url: `/category/${id}`,
            method: 'GET',
          };
        },
      }),
      fetchAllCategories: builder.query({
        providesTags: ['Category'],
        query: () => {
          return {
            url: '/category',
            method: 'GET',
          };
        },
      }),

    };
  },
});

export const {
  useFetchAllCategoriesQuery,
  useAddCategoryMutation,
  useFetchCategoryByIdQuery,
  useDeleteCategoryByIdMutation,
  useEditCategoryByIdMutation,
  useFetch4CategoriesQuery
} = categoryApi;
export { categoryApi };
