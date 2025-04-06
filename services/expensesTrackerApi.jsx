import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { clearTokens } from '../authSlice.jsx';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        console.log('401 Unauthorized - Logging out');
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        api.dispatch(clearTokens());
        router.replace('/auth/login');
    }
    return result;
};

export const expensesTrackerApi = createApi({
    reducerPath: 'expensesTrackerApi',
    tagTypes: ['User', 'Category', 'Expense', 'Budget'],
    baseQuery: baseQueryWithAuth,
    endpoints: (build) => ({
        register: build.mutation({
            query: (data) => ({
                url: 'register-account',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        login: build.mutation({
            query: (data) => ({
                url: 'login',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    await AsyncStorage.setItem('access_token', data.access_token);
                    await AsyncStorage.setItem('refresh_token', data.refresh_token);
                } catch (error) {
                    console.error('Failed to store token:', error);
                }
            },
        }),
        getUser: build.query({
            query: () => ({
                url: 'admin/view-all-users',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        removeCategory: build.mutation({
            query: (name) => ({
                url: `admin/remove-category/${name}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Category'],
        }),
        addCategory: build.mutation({
            query: (data) => ({
                url: 'admin/add-category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        createExpenses: build.mutation({
            query: (data) => ({
                url: 'create-expenses',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Expense'],
        }),
        viewExpenses: build.query({
            query: () => ({
                url: 'view-expenses',
                method: 'GET',
            }),
            providesTags: ['Expense'],
        }),
        createBudget: build.mutation({
            query: (data) => ({
                url: 'create-budget',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Budget'],
        }),
        addACategory: build.mutation({
            query: (data) => ({
                url: 'add-a-category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        getAllCategories: build.query({
            query: () => ({
                url: 'get-all-categories',
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        updateBudget: build.mutation({
            query: (data) => ({
                url: 'update-budget',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Budget'],
        }),
        getBudget: build.query({
            query: () => ({
                url: 'get-budget',
                method: 'GET',
            }),
            providesTags: ['Budget'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUserQuery,
    useRemoveCategoryMutation,
    useAddCategoryMutation,
    useCreateExpensesMutation,
    useViewExpensesQuery,
    useCreateBudgetMutation,
    useUpdateBudgetMutation,
    useGetBudgetQuery,
    useGetAllCategoriesQuery,
    useAddACategoryMutation,
} = expensesTrackerApi;