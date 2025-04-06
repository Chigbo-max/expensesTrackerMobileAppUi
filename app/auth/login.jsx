import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useLoginMutation } from '../../services/expensesTrackerApi';
import { useDispatch } from 'react-redux';
import { setTokens } from '../../authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const result = await login({ email }).unwrap();
            dispatch(setTokens({ access_token: result.access_token, refresh_token: result.refresh_token }));
            router.replace('/dashboard');
        } catch (err) {
            setErrorMessage(err.data?.message || 'Login failed');
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 justify-center items-center bg-primary/80 p-6">
                <Text className="text-4xl font-bold text-light-100 mb-8">Welcome Back</Text>

                <View className="w-full bg-secondary p-6 rounded-2xl shadow-lg">
                    <Text className="text-light-200 text-lg mb-4">Login to your account</Text>

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
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text className="text-light-100 text-center font-semibold text-lg">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                        <Text className="text-light-300 text-center mt-4">
                            Don’t have an account?{' '}
                            <Text className="text-accent font-semibold">Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Login;
