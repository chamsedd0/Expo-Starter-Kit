import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Calendar, DollarSign, FileText, Briefcase } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { RecentActivityLogs } from '../components/organisms/RecentActivityLogs';
import { GradientCard } from '../components/ui/GradientCard';
import { AppHeader } from '../components/organisms/AppHeader';

export default function RequestsTabScreen() {
    const { isDarkMode, accentColor } = useTheme();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const requestTypes = [
        {
            id: 'time-off',
            title: 'Time Off',
            subtitle: 'Vacation, Sick Leave',
            icon: <Calendar size={28} color="white" />,
            color: '#A855F7', // Purple
            route: '/request-form?type=time-off'
        },
        {
            id: 'expense',
            title: 'Expense',
            subtitle: 'Reimbursements',
            icon: <DollarSign size={28} color="white" />,
            color: '#10B981', // Emerald
            route: '/request-form?type=expense'
        },
        {
            id: 'letter',
            title: 'Letter Request',
            subtitle: 'HR Documents',
            icon: <FileText size={28} color="white" />,
            color: '#3B82F6', // Blue
            route: '/request-form?type=letter'
        },
        {
            id: 'mission',
            title: 'Mission',
            subtitle: 'Travel Orders',
            icon: <Briefcase size={28} color="white" />,
            color: '#F59E0B', // Amber
            route: '/request-form?type=mission'
        }
    ];

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View className="flex-1">
                    <View className="px-5">
                        <AppHeader title="Requests" />
                    </View>

                    <ScrollView
                        className="flex-1 px-5"
                        contentContainerStyle={{ paddingBottom: 150 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accentColor} />
                        }
                    >
                        {/* Request Category Grid */}
                        <View className="flex-row flex-wrap justify-between mb-8">
                            {requestTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={() => router.push(type.route as any)}
                                    activeOpacity={0.8}
                                    className="w-[48%] mb-4"
                                >
                                    <GradientCard
                                        variant="surface"
                                        className="h-40 justify-between p-4"
                                        style={{
                                            borderLeftWidth: 4,
                                            borderLeftColor: type.color
                                        }}
                                    >
                                        <View
                                            className="w-12 h-12 rounded-xl items-center justify-center mb-2"
                                            style={{ backgroundColor: type.color }}
                                        >
                                            {type.icon}
                                        </View>
                                        <View>
                                            <Text className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {type.title}
                                            </Text>
                                            <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {type.subtitle}
                                            </Text>
                                        </View>
                                    </GradientCard>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Recent Activities Section */}
                        <RecentActivityLogs />

                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
