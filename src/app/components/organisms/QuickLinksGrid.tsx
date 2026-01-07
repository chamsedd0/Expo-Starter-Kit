import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, DollarSign, FileText, Briefcase } from 'lucide-react-native';
import { router } from 'expo-router';

export const QuickLinksGrid: React.FC = () => {
    const { isDarkMode, accentColor } = useTheme();

    const links = [
        {
            id: 'new-time-off',
            title: 'New Request',
            subtitle: 'Time Off',
            Icon: Calendar,
            onPress: () => router.push('/(tabs)/requests'),
        },
        {
            id: 'new-expense',
            title: 'Submit',
            subtitle: 'Expense',
            Icon: DollarSign,
            onPress: () => router.push('/(tabs)/expenses'),
        },
        {
            id: 'payslips',
            title: 'My',
            subtitle: 'Payslips',
            Icon: FileText,
            onPress: () => console.log('Payslips'), // Placeholder
        },
        {
            id: 'directory',
            title: 'Employee',
            subtitle: 'Directory',
            Icon: Briefcase,
            onPress: () => console.log('Directory'), // Placeholder
        }
    ];

    return (
        <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Quick Links
            </Text>

            <View className="flex-row flex-wrap justify-between gap-y-4">
                {links.map((link) => (
                    <TouchableOpacity
                        key={link.id}
                        onPress={link.onPress}
                        activeOpacity={0.9}
                        className={`w-[48%] p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 3
                        }}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <link.Icon size={24} color={accentColor} strokeWidth={2} />
                        </View>
                        <Text className={`text-xs font-semibold mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {link.title}
                        </Text>
                        <Text className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {link.subtitle}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
