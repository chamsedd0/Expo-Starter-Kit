import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useStore';
import { apiClient } from '../../api/client';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { GlassInput } from '../components/ui/GlassInput';
import { StyledButton } from '../components/ui/StyledButton';
import { User, Lock, ArrowRight } from 'lucide-react-native';
import { GradientCard } from '../components/ui/GradientCard';

export default function LoginScreen() {
    const [employeeId, setEmployeeId] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const { isDarkMode, accentColor } = useTheme();

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
        <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B', '#111827'] : ['#2563EB', '#60A5FA', '#EFF6FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo / Branding Section */}
                        <View className="items-center mb-8">
                            <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 shadow-xl ${isDarkMode ? 'bg-indigo-500/20' : 'bg-white/20'}`}>
                                <View className={`w-16 h-16 rounded-full items-center justify-center bg-white shadow-sm`}>
                                    <User color={accentColor} size={32} strokeWidth={2.5} />
                                </View>
                            </View>
                            <Text className={`text-4xl font-extrabold text-white mb-2 tracking-tight shadow-md`}>
                                ERP Portal
                            </Text>
                            <Text className={`text-white/80 font-medium text-base tracking-wide`}>
                                Employee Access
                            </Text>
                        </View>

                        {/* Login Card */}
                        <GradientCard variant="surface" className="p-6 rounded-[32px] shadow-2xl border border-white/20">
                            <View className="space-y-6">
                                <View>
                                    <Text className={`text-sm font-bold mb-2 ml-4 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Employee ID
                                    </Text>
                                    <GlassInput
                                        placeholder="12345"
                                        value={employeeId}
                                        onChangeText={setEmployeeId}
                                        autoCapitalize="none"
                                        icon={<User size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={2} />}
                                    />
                                </View>

                                <View>
                                    <Text className={`text-sm font-bold mb-2 ml-4 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        PIN Code
                                    </Text>
                                    <GlassInput
                                        placeholder="••••"
                                        value={pin}
                                        onChangeText={setPin}
                                        secureTextEntry
                                        keyboardType="numeric"
                                        icon={<Lock size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={2} />}
                                    />
                                </View>

                                <View className="mt-4 pt-2">
                                    <StyledButton
                                        title="Sign In"
                                        onPress={handleLogin}
                                        loading={loading}
                                        icon={<ArrowRight size={20} color="white" strokeWidth={2.5} />}
                                    />
                                </View>
                            </View>
                        </GradientCard>

                        <View className="mt-8 items-center">
                            <Text className="text-white/60 text-xs">
                                © 2026 Enterprise ERP
                            </Text>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}
