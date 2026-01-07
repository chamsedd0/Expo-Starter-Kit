import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { GradientCard } from '../ui/GradientCard';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock, Calendar, DollarSign, ChevronRight, AlertCircle } from 'lucide-react-native';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useStore';

interface PendingItem {
    id: number;
    type: 'time_off' | 'expense';
    title: string;
    subtitle: string;
    date: string;
    status: string;
}

export const PendingRequests: React.FC = () => {
    const { isDarkMode, accentColor } = useTheme();
    const { employee } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [latestPending, setLatestPending] = useState<PendingItem | null>(null);

    useEffect(() => {
        fetchPendingData();
    }, [employee]);

    const fetchPendingData = async () => {
        if (!employee) return;
        try {
            setLoading(true);
            const [leavesRes, expensesRes] = await Promise.all([
                apiClient.getTimeOffRequests(employee.id),
                apiClient.getExpenses(employee.id)
            ]);

            const pendingLeaves = leavesRes.leaves
                .filter((l: any) => l.state === 'confirm') // 'confirm' is usually pending approval in Odoo
                .map((l: any) => ({
                    id: l.id,
                    type: 'time_off' as const,
                    title: l.name || 'Time Off Request',
                    subtitle: `${l.number_of_days} days`,
                    date: l.date_from,
                    status: 'Pending'
                }));

            const pendingExpenses = expensesRes.expenses
                .filter((e: any) => e.state === 'draft' || e.state === 'submit') // draft or submitted
                .map((e: any) => ({
                    id: e.id,
                    type: 'expense' as const,
                    title: e.name || 'Expense',
                    subtitle: `$${e.total_amount}`,
                    date: e.date,
                    status: 'Pending'
                }));

            const allPending = [...pendingLeaves, ...pendingExpenses].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setLatestPending(allPending.length > 0 ? allPending[0] : null);
        } catch (error) {
            console.error('Failed to fetch pending requests', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="mb-6 h-32 justify-center items-center">
                <ActivityIndicator color={accentColor} />
            </View>
        );
    }

    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
                <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Pending Requests
                </Text>
                <TouchableOpacity>
                    <Text className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        See All
                    </Text>
                </TouchableOpacity>
            </View>

            {latestPending ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push(`/request-details?id=${latestPending.id}&type=${latestPending.type}`)}
                >
                    <GradientCard variant="primary" className="p-5 rounded-3xl">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center bg-white/20 self-start px-3 py-1.5 rounded-full backdrop-blur-sm">
                                {latestPending.type === 'time_off' ? (
                                    <Calendar size={14} color="white" strokeWidth={2.5} />
                                ) : (
                                    <DollarSign size={14} color="white" strokeWidth={2.5} />
                                )}
                                <Text className="text-white text-xs font-bold ml-1.5 uppercase tracking-wider">
                                    {latestPending.type === 'time_off' ? 'Time Off' : 'Expense'}
                                </Text>
                            </View>
                            <Text className="text-white/80 text-xs font-medium">
                                {new Date(latestPending.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>

                        <Text className="text-white text-2xl font-bold mb-1 tracking-tight">
                            {latestPending.title}
                        </Text>
                        <Text className="text-white/90 text-sm font-medium mb-6">
                            {latestPending.subtitle}
                        </Text>

                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                                <Text className="text-white text-sm font-bold">
                                    Waiting for approval
                                </Text>
                            </View>
                            <View className="bg-white/20 p-2.5 rounded-full">
                                <ChevronRight size={20} color="white" strokeWidth={2.5} />
                            </View>
                        </View>
                    </GradientCard>
                </TouchableOpacity>
            ) : (
                <View className={`p-6 rounded-2xl border-2 border-dashed items-center ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                    <AlertCircle size={24} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                    <Text className={`text-sm mt-2 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        No pending requests
                    </Text>
                </View>
            )}
        </View>
    );
};
