import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle2, XCircle, User, FileText } from 'lucide-react-native';
import { useTheme } from './contexts/ThemeContext';
import { GradientCard } from './components/ui/GradientCard';

// Dummy data generator since we don't have a single "get details" API yet
const getMockDetails = (id: string, type: string) => {
    const isExpense = type === 'expense';
    return {
        id,
        type,
        title: isExpense ? 'Client Dinner' : 'Annual Leave',
        status: 'pending', // pending, approved, refused
        date: new Date().toISOString(),
        amountOrDays: isExpense ? '$120.50' : '5 Days',
        description: isExpense ? 'Dinner with client at Downtown Restaurant to discuss Q4 roadmap.' : 'Family vacation time.',
        history: [
            { date: '2024-01-20 09:00', event: 'Request Created', user: 'You' },
            { date: '2024-01-20 10:30', event: 'Manager Approval', user: 'Pending' },
        ]
    };
};

export default function RequestDetailsScreen() {
    const { isDarkMode, accentColor } = useTheme();
    const params = useLocalSearchParams();
    const { id, type } = params;

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setDetails(getMockDetails(id as string, type as string));
            setLoading(false);
        }, 1000);
    }, [id, type]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#10B981';
            case 'refused': return '#EF4444';
            default: return '#F59E0B'; // Amber for pending
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 size={24} color="white" />;
            case 'refused': return <XCircle size={24} color="white" />;
            default: return <Clock size={24} color="white" />;
        }
    };

    if (loading) {
        return (
            <LinearGradient
                colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <ActivityIndicator size="large" color={accentColor} />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
            style={{ flex: 1 }}
        >
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <View className="flex-1">
                    {/* Header */}
                    <View className="px-5 py-2 flex-row items-center mb-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className={`p-2 rounded-full mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
                        >
                            <ArrowLeft size={24} color={isDarkMode ? 'white' : 'black'} />
                        </TouchableOpacity>
                        <View>
                            <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Request Details
                            </Text>
                            <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                ID: #{id}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1 px-5"
                        contentContainerStyle={{ paddingBottom: 150 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Status Banner */}
                        <GradientCard
                            className="p-6 mb-6 items-center justify-center py-8"
                            style={{
                                backgroundColor: getStatusColor(details.status)
                            }}
                        >
                            <View className="mb-2">
                                {getStatusIcon(details.status)}
                            </View>
                            <Text className="text-white text-2xl font-bold uppercase tracking-widest">
                                {details.status}
                            </Text>
                            <Text className="text-white/80 text-sm mt-1">
                                Current Status
                            </Text>
                        </GradientCard>

                        {/* Main Information */}
                        <View className="mb-6">
                            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Overview
                            </Text>
                            <GradientCard variant="surface" className="p-4">
                                <View className="flex-row items-start mb-4">
                                    <View className={`p-3 rounded-xl mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        {details.type === 'expense' ? (
                                            <DollarSign size={24} color={accentColor} />
                                        ) : (
                                            <Calendar size={24} color={accentColor} />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {details.title}
                                        </Text>
                                        <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {details.type === 'expense' ? 'Expense Claim' : 'Time Off Request'}
                                        </Text>
                                    </View>
                                    <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {details.amountOrDays}
                                    </Text>
                                </View>

                                <View className={`h-[1px] w-full my-2 bg-gray-200/10`} />

                                <View className="mt-2">
                                    <Text className={`text-xs font-bold mb-1 uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Description
                                    </Text>
                                    <Text className={`text-base leading-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {details.description}
                                    </Text>
                                </View>
                            </GradientCard>
                        </View>

                        {/* Timeline / Logs */}
                        <View className="mb-6">
                            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Approval Timeline
                            </Text>
                            <View className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                {details.history.map((log: any, index: number) => (
                                    <View key={index} className="flex-row mb-4 last:mb-0 relative">
                                        {/* Vertical Line */}
                                        {index !== details.history.length - 1 && (
                                            <View className={`absolute left-[11px] top-6 bottom-[-20px] w-[2px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                                        )}

                                        <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 z-10 ${index === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`}>
                                            <View className="w-2.5 h-2.5 bg-white rounded-full" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {log.event}
                                            </Text>
                                            <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {log.user} • {log.date}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
