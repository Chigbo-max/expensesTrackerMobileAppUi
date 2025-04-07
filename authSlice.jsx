import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true, 
    },
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setTokens, clearTokens, setLoading } = authSlice.actions;

export const initializeAuth = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (accessToken && refreshToken) {
            dispatch(setTokens({ access_token: accessToken, refresh_token: refreshToken }));
        }
    } catch (error) {
        console.error('Failed to load tokens from AsyncStorage:', error);
    } finally {
        dispatch(setLoading(false));
    }
};

export default authSlice.reducer;
