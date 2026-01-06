import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useStore';
import { apiClient } from '../../api/client';
import { router } from 'expo-router';

export default function LoginScreen() {
    const [employeeId, setEmployeeId] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleLogin = async () => {
        if (!employeeId || !pin) {
            Alert.alert('Error', 'Please enter both Employee ID and PIN');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.login(employeeId, pin);
            login(response.token, response.user);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-6 justify-center">
            <View className="bg-card rounded-lg p-6 shadow-sm">
                <Text className="text-3xl font-bold text-foreground mb-2 text-center">
                    Employee Portal
                </Text>
                <Text className="text-sm text-muted-foreground mb-6 text-center">
                    Sign in with your credentials
                </Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-medium text-foreground mb-2">Employee ID</Text>
                        <TextInput
                            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                            placeholder="Enter employee ID"
                            placeholderTextColor="#888"
                            value={employeeId}
                            onChangeText={setEmployeeId}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-foreground mb-2">PIN</Text>
                        <TextInput
                            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                            placeholder="Enter PIN"
                            placeholderTextColor="#888"
                            value={pin}
                            onChangeText={setPin}
                            secureTextEntry
                            keyboardType="numeric"
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        className={`py-3 px-6 rounded-lg mt-4 ${loading ? 'bg-muted' : 'bg-primary'}`}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-primary-foreground font-semibold text-center text-lg">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
