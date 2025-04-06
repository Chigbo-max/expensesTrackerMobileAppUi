// app/dashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useViewExpensesQuery } from '../services/expensesTrackerApi.jsx';
import { useDispatch } from 'react-redux';
import { clearTokens } from '../authSlice.jsx';
import { router } from 'expo-router';

const Dashboard = ({ navigation }) => { // Add navigation prop
    const { data: expenses, error, isLoading } = useViewExpensesQuery();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        dispatch(clearTokens());
        router.replace('/auth/login'); // This is fine since it navigates outside the tab navigator
    };

    return (
        <View className="flex-1 justify-center items-center bg-primary p-6">
            <Text className="text-3xl font-bold text-light-100 mb-8">
                Welcome to Dashboard
            </Text>

            {isLoading ? (
                <Text className="text-light-200 mb-4">Loading expenses...</Text>
            ) : error ? (
                <Text className="text-red-500 mb-4">Failed to load expenses: {error.data?.message || 'Unknown error'}</Text>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className="bg-secondary p-4 rounded-lg mb-2">
                            <Text className="text-light-200">
                                {item.description}: ${item.amount} (Category: {item.category})
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text className="text-light-200 mb-4">No expenses found.</Text>}
                />
            )}

            <TouchableOpacity
                className="bg-accent p-4 rounded-lg mb-4"
                onPress={() => navigation.navigate('settings')} // Use navigation.navigate
            >
                <Text className="text-light-100 text-center font-semibold text-lg">
                    Go to Settings
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-accent p-4 rounded-lg mb-4"
                onPress={() => navigation.navigate('profile')} // Use navigation.navigate
            >
                <Text className="text-light-100 text-center font-semibold text-lg">
                    Go to Profile
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-red-500 p-4 rounded-lg"
                onPress={handleLogout}
            >
                <Text className="text-light-100 text-center font-semibold text-lg">
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Dashboard;