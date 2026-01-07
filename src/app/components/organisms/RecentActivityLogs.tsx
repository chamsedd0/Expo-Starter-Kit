import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useStore';

interface ActivityItem {
    id: string; // Composite ID
    type: 'time_off' | 'expense';
    title: string;
    date: string;
    status: string;
    amountOrDays: string;
}

export const RecentActivityLogs: React.FC = () => {
    const { isDarkMode, accentColor } = useTheme();
    const { employee } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        fetchActivity();
    }, [employee]);

    const fetchActivity = async () => {
        if (!employee) return;
        try {
            setLoading(true);
            const [leavesRes, expensesRes] = await Promise.all([
                apiClient.getTimeOffRequests(employee.id),
                apiClient.getExpenses(employee.id)
            ]);

            const leaves = leavesRes.leaves.map((l: any) => ({
                id: `l-${l.id}`,
                type: 'time_off' as const,
                title: l.name || 'Time Off Request',
                date: l.create_date || l.date_from, // Use create_date if available
                status: l.state,
                amountOrDays: `${l.number_of_days} days`
            }));

            const expenses = expensesRes.expenses.map((e: any) => ({
                id: `e-${e.id}`,
                type: 'expense' as const,
                title: e.name || 'Expense',
                date: e.date,
                status: e.state,
                amountOrDays: `$${e.total_amount}`
            }));

            const combined = [...leaves, ...expenses]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5); // Start with top 5

            setActivities(combined);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'validate':
            case 'approved':
            case 'done':
                return <CheckCircle2 size={16} color="#10B981" />;
            case 'refuse':
            case 'refused':
                return <XCircle size={16} color="#EF4444" />;
            default:
                return <Clock size={16} color="#F59E0B" />;
        }
    };

    if (loading) return null;

    return (
        <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Recent Activity
            </Text>

            <View className={`rounded-3xl overflow-hidden border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                {activities.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => router.push(`/request-details?id=${item.id}&type=${item.type}`)}
                        activeOpacity={0.7}
                        className={`flex-row items-center p-4 ${index !== activities.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${item.type === 'time_off' ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'
                            }`}>
                            {item.type === 'time_off' ? (
                                <Calendar size={20} color={item.type === 'time_off' ? '#9333EA' : '#10B981'} strokeWidth={2.5} />
                            ) : (
                                <DollarSign size={20} color="#10B981" strokeWidth={2.5} />
                            )}
                        </View>

                        <View className="flex-1 mr-2">
                            <Text className={`text-base font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>

                        <View className="items-end">
                            <Text className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {item.amountOrDays}
                            </Text>
                            {getStatusIcon(item.status)}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
