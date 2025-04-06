import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useRegisterMutation } from '../../services/expensesTrackerApi';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTokens } from '../../authSlice';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();

    const handleSignup = async () => {
        try {
            const result = await register({ email }).unwrap();
            await AsyncStorage.setItem('access_token', result.access_token);
            await AsyncStorage.setItem('refresh_token', result.refresh_token);
            dispatch(setTokens({ access_token: result.access_token, refresh_token: result.refresh_token }));
            router.replace('/dashboard');
        } catch (err) {
            setErrorMessage(err.data?.message || 'Signup failed');
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 justify-center items-center bg-primary/80 p-6">
                <Text className="text-4xl font-bold text-light-100 mb-8">Create Account</Text>

                <View className="w-full bg-secondary p-6 rounded-2xl shadow-lg">
                    <Text className="text-light-200 text-lg mb-4">Sign up to get started</Text>

                    <TextInput
                        className="w-full bg-dark-100 text-light-200 p-4 rounded-lg mb-4"
                        placeholder="Email"
                        placeholderTextColor="#9CA4AB"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {errorMessage ? (
                        <Text className="text-red-500 mb-4">{errorMessage}</Text>
                    ) : null}

                    <TouchableOpacity
                        className="bg-accent p-4 rounded-lg"
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        <Text className="text-light-100 text-center font-semibold text-lg">
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text className="text-light-300 text-center mt-4">
                            Already have an account?{' '}
                            <Text className="text-accent font-semibold">Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default SignUp;