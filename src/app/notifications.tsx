import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Check, Clock, AlertCircle, Info } from 'lucide-react-native';
import { useTheme } from './contexts/ThemeContext';
import { GradientCard } from './components/ui/GradientCard';

// Mock Data
const initialNotifications = [
    {
        id: 1,
        title: 'Expense Approved',
        message: 'Your expense report for "Client Dinner" ($120.50) has been approved.',
        time: '2 hours ago',
        read: false,
        type: 'success'
    },
    {
        id: 2,
        title: 'Leave Request Update',
        message: 'Manager requested more info for your "Annual Leave" request.',
        time: '5 hours ago',
        read: false,
        type: 'warning'
    },
    {
        id: 3,
        title: 'Payslip Available',
        message: 'Your payslip for December 2025 is now available for download.',
        time: '1 day ago',
        read: true,
        type: 'info'
    },
    {
        id: 4,
        title: 'System Maintenance',
        message: 'The system will be down for maintenance on Saturday from 2 AM to 4 AM.',
        time: '2 days ago',
        read: true,
        type: 'alert'
    }
];

export default function NotificationsScreen() {
    const { isDarkMode, accentColor } = useTheme();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check size={20} color="white" />;
            case 'warning': return <AlertCircle size={20} color="white" />;
            case 'alert': return <Bell size={20} color="white" />;
            default: return <Info size={20} color="white" />;
        }
    };

    const getIconBgColor = (type: string) => {
        switch (type) {
            case 'success': return '#10B981'; // Emerald
            case 'warning': return '#F59E0B'; // Amber
            case 'alert': return '#EF4444'; // Red
            default: return '#3B82F6'; // Blue
        }
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View className="flex-1">
                    {/* Header */}
                    <View className="px-5 py-2 flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className={`p-2 rounded-full mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
                            >
                                <ArrowLeft size={24} color={isDarkMode ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <View>
                                <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Notifications
                                </Text>
                                <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Stay updated with latest activities
                                </Text>
                            </View>
                        </View>

                        {notifications.some(n => !n.read) && (
                            <TouchableOpacity onPress={markAllAsRead}>
                                <Text className={`text-xs font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                    Mark all as read
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        className="flex-1 px-5"
                        contentContainerStyle={{ paddingBottom: 150 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />
                        }
                    >
                        {notifications.length === 0 ? (
                            <View className="items-center py-20">
                                <Bell size={48} color={isDarkMode ? '#334155' : '#CBD5E1'} />
                                <Text className={`mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    No notifications yet
                                </Text>
                            </View>
                        ) : (
                            <View className="space-y-3">
                                {notifications.map((item) => (
                                    <GradientCard
                                        key={item.id}
                                        variant="surface"
                                        className={`p-4 ${!item.read ? (isDarkMode ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-blue-500') : ''}`}
                                        style={!item.read ? { borderLeftWidth: 4, borderLeftColor: accentColor } : {}}
                                    >
                                        <View className="flex-row gap-3">
                                            <View
                                                className="w-10 h-10 rounded-full items-center justify-center mt-1"
                                                style={{ backgroundColor: getIconBgColor(item.type) }}
                                            >
                                                {getIcon(item.type)}
                                            </View>
                                            <View className="flex-1">
                                                <View className="flex-row justify-between items-start">
                                                    <Text className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {item.title}
                                                    </Text>
                                                    <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {item.time}
                                                    </Text>
                                                </View>
                                                <Text className={`text-sm leading-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    {item.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </GradientCard>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
