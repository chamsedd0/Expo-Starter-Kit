import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Search, Bell, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

interface AppHeaderProps {
    onSearch?: (query: string) => void;
    onNotificationPress?: () => void;
    notificationCount?: number;
    showBack?: boolean;
    title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    onSearch,
    notificationCount = 0,
    showBack = false,
    title
}) => {
    const { isDarkMode } = useTheme();

    return (
        <View className="flex-row items-center justify-between gap-3 mb-6 pt-2">

            {/* Back Button (Conditional) */}
            {showBack && (
                <TouchableOpacity
                    onPress={() => router.back()}
                    className={`w-12 h-12 items-center justify-center rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}
                >
                    <ArrowLeft size={22} color={isDarkMode ? '#E2E8F0' : '#475569'} strokeWidth={2.5} />
                </TouchableOpacity>
            )}

            {/* Title (If provided) or Search Bar */}
            {title ? (
                <View className="flex-1 justify-center">
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {title}
                    </Text>
                </View>
            ) : (
                <View
                    className={`flex-1 flex-row items-center h-12 px-4 rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}
                >
                    <Search size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} strokeWidth={2.5} />
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
                        className={`flex-1 ml-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                        onChangeText={onSearch}
                    />
                </View>
            )}

            {/* Notification Button */}
            <TouchableOpacity
                onPress={() => router.push('/notifications')}
                className={`w-12 h-12 items-center justify-center rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }}
            >
                <Bell size={22} color={isDarkMode ? '#E2E8F0' : '#475569'} strokeWidth={2.5} />
                {notificationCount > 0 && (
                    <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                )}
            </TouchableOpacity>
        </View>
    );
};
