import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useStore';
import { API_URL } from '../../config';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { employee, logout } = useAuthStore();
    const [serverStatus, setServerStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        setServerStatus('');
        try {
            const response = await fetch(`${API_URL}/`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            const text = await response.text();
            setServerStatus(`✅ ${text}`);
        } catch (error: any) {
            setServerStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 p-4">
                <View className="bg-card rounded-lg p-6 mb-4">
                    <Text className="text-2xl font-bold text-foreground mb-4">
                        Employee Profile
                    </Text>

                    {employee && (
                        <View className="space-y-2">
                            <View className="mb-3">
                                <Text className="text-sm text-muted-foreground">Name</Text>
                                <Text className="text-lg font-semibold text-foreground">{employee.name}</Text>
                            </View>

                            <View className="mb-3">
                                <Text className="text-sm text-muted-foreground">Employee ID</Text>
                                <Text className="text-lg font-semibold text-foreground">{employee.id}</Text>
                            </View>

                            {employee.department && (
                                <View className="mb-3">
                                    <Text className="text-sm text-muted-foreground">Department</Text>
                                    <Text className="text-lg font-semibold text-foreground">{employee.department}</Text>
                                </View>
                            )}

                            {employee.job_title && (
                                <View className="mb-3">
                                    <Text className="text-sm text-muted-foreground">Job Title</Text>
                                    <Text className="text-lg font-semibold text-foreground">{employee.job_title}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    <TouchableOpacity
                        className="bg-destructive py-3 px-6 rounded-lg mt-4"
                        onPress={handleLogout}
                    >
                        <Text className="text-destructive-foreground font-semibold text-center">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-card rounded-lg p-6">
                    <Text className="text-xl font-bold text-foreground mb-2">
                        Backend Connection
                    </Text>
                    <Text className="text-sm text-muted-foreground mb-4">{API_URL}</Text>

                    <TouchableOpacity
                        className={`py-3 px-6 rounded-lg ${loading ? 'bg-muted' : 'bg-primary'}`}
                        onPress={testConnection}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-primary-foreground font-semibold text-center">
                                Test Connection
                            </Text>
                        )}
                    </TouchableOpacity>

                    {serverStatus ? (
                        <Text className="mt-4 text-foreground">{serverStatus}</Text>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
