import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, FileText, DollarSign, Info, Upload, Check } from 'lucide-react-native';
import { useTheme } from './contexts/ThemeContext';
import { GradientCard } from './components/ui/GradientCard';
import { GlassInput } from './components/ui/GlassInput';
import { StyledButton } from './components/ui/StyledButton';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RequestFormScreen() {
    const { isDarkMode, accentColor } = useTheme();
    const params = useLocalSearchParams();
    const type = params.type as string || 'time-off';

    const [formData, setFormData] = useState({
        dateFrom: new Date(),
        dateTo: new Date(),
        description: '',
        amount: '',
        quantity: '1',
        destination: '',
        attachment: null
    });

    const [showDatePicker, setShowDatePicker] = useState({ show: false, mode: 'from' });

    const getPageTitle = () => {
        switch (type) {
            case 'time-off': return 'Time Off Request';
            case 'expense': return 'Submit Expense';
            case 'mission': return 'Mission Order';
            case 'letter': return 'Letter Request';
            default: return 'New Request';
        }
    };

    const getPageIcon = () => {
        switch (type) {
            case 'time-off': return <Calendar size={24} color={accentColor} />;
            case 'expense': return <DollarSign size={24} color={accentColor} />;
            default: return <FileText size={24} color={accentColor} />;
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(prev => ({ ...prev, show: false }));
        if (selectedDate) {
            if (showDatePicker.mode === 'from') {
                setFormData(prev => ({ ...prev, dateFrom: selectedDate }));
            } else {
                setFormData(prev => ({ ...prev, dateTo: selectedDate }));
            }
        }
    };

    const handleSubmit = () => {
        Alert.alert('Success', `${getPageTitle()} submitted successfully!`);
        router.back();
    };

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
                                {getPageTitle()}
                            </Text>
                            <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Fill in the details below
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1 px-5"
                        contentContainerStyle={{ paddingBottom: 150 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Main Form Section */}
                        <GradientCard variant="surface" className="p-4 mb-6">
                            <View className="flex-row items-center mb-6 border-b border-gray-100/10 pb-4">
                                <View className={`p-3 rounded-xl mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    {getPageIcon()}
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Details
                                    </Text>
                                    <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Please provide accurate information
                                    </Text>
                                </View>
                            </View>

                            {/* Dynamic Fields */}
                            <View className="space-y-4">
                                {type === 'time-off' && (
                                    <View className="flex-row gap-3">
                                        <View className="flex-1">
                                            <Text className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>From</Text>
                                            <TouchableOpacity
                                                onPress={() => setShowDatePicker({ show: true, mode: 'from' })}
                                                className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            >
                                                <Text className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                                                    {formData.dateFrom.toLocaleDateString()}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>To</Text>
                                            <TouchableOpacity
                                                onPress={() => setShowDatePicker({ show: true, mode: 'to' })}
                                                className={`p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            >
                                                <Text className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                                                    {formData.dateTo.toLocaleDateString()}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {type === 'expense' && (
                                    <View className="flex-row gap-3">
                                        <View className="flex-1">
                                            <GlassInput
                                                label="Amount"
                                                icon={<DollarSign size={16} color={isDarkMode ? '#94A3B8' : '#64748B'} />}
                                                value={formData.amount}
                                                onChangeText={(t) => setFormData({ ...formData, amount: t })}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date</Text>
                                            <TouchableOpacity
                                                onPress={() => setShowDatePicker({ show: true, mode: 'from' })}
                                                className={`p-3 rounded-xl border h-[56px] justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            >
                                                <Text className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                                                    {formData.dateFrom.toLocaleDateString()}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {type === 'mission' && (
                                    <GlassInput
                                        label="Destination"
                                        value={formData.destination}
                                        onChangeText={(t) => setFormData({ ...formData, destination: t })}
                                    />
                                )}

                                <GlassInput
                                    label="Description"
                                    multiline
                                    numberOfLines={3}
                                    style={{ height: 80, textAlignVertical: 'top' }}
                                    value={formData.description}
                                    onChangeText={(t) => setFormData({ ...formData, description: t })}
                                />

                                {/* Attachment Upload Dummy */}
                                <TouchableOpacity className={`border-2 border-dashed p-4 rounded-xl items-center flex-row justify-center gap-2 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                                    <Upload size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} />
                                    <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Attach Receipt / Document
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6">
                                <StyledButton title="Submit Request" onPress={handleSubmit} />
                            </View>
                        </GradientCard>

                        {/* Additional Section: Helpful Tips / Policy */}
                        <View className="mb-6">
                            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Helpful Tips
                            </Text>
                            <View className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
                                <View className="flex-row gap-3">
                                    <Info size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                                    <View className="flex-1">
                                        <Text className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            Did you know?
                                        </Text>
                                        <Text className={`text-sm leading-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {type === 'time-off'
                                                ? "Leave requests should be submitted at least 3 days in advance for proper approval processing."
                                                : "Make sure to attach clear photos of receipts for all expenses over $20."}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {showDatePicker.show && (
                            <DateTimePicker
                                value={showDatePicker.mode === 'from' ? formData.dateFrom : formData.dateTo}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
