// app/_layout.js
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { store } from '../store.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initializeAuth } from '../authSlice.jsx';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "./globals.css"

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoading === true) {
            dispatch(initializeAuth());
        }
    }, [dispatch, isLoading]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <Text className="text-light-100 text-lg">Loading...</Text>
            </View>
        );
    }

    return isAuthenticated ? (
        <Screen.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="dashboard"
        >
            <Stack.Screen name="dashboard" component={require('./dashboard').default} />
            {/*<Tab.Screen name="profile" component={require('./profile').default} />*/}
        </Screen.Navigator>
    ) : (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="auth/login"
        >
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        </Stack>
    );
};

const RootLayout = () => {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
};

export default RootLayout;