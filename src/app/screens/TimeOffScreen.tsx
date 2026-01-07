import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/useStore';
import { apiClient } from '../../api/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../contexts/ThemeContext';
import { GradientCard } from '../components/ui/GradientCard';
import { GlassInput } from '../components/ui/GlassInput';
import { StyledButton } from '../components/ui/StyledButton';
import { Calendar, Clock, FileText } from 'lucide-react-native';

interface LeaveType {
    id: number;
    name: string;
}

interface Leave {
    id: number;
    name: string;
    holiday_status_id: [number, string];
    date_from: string;
    date_to: string;
    number_of_days: number;
    state: string;
}

export default function TimeOffScreen() {
    const employee = useAuthStore((state) => state.employee);
    const { isDarkMode, accentColor } = useTheme();
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [showDateFromPicker, setShowDateFromPicker] = useState(false);
    const [showDateToPicker, setShowDateToPicker] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [typesRes, leavesRes] = await Promise.all([
                apiClient.getTimeOffTypes(),
                employee ? apiClient.getTimeOffRequests(employee.id) : Promise.resolve({ leaves: [] }),
            ]);
            setLeaveTypes(typesRes.types);
            setLeaves(leavesRes.leaves);
            if (typesRes.types.length > 0) {
                setSelectedTypeId(typesRes.types[0].id);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!employee || !selectedTypeId) {
            Alert.alert('Error', 'Please select a leave type');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.createTimeOffRequest({
                employee_id: employee.id,
                holiday_status_id: selectedTypeId,
                date_from: dateFrom.toISOString(),
                date_to: dateTo.toISOString(),
                name: description || 'Time Off Request',
            });
            Alert.alert('Success', 'Time-off request submitted!');
            setDescription('');
            await loadData();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'validate': return 'text-emerald-500';
            case 'confirm': return 'text-blue-500';
            case 'refuse': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
            style={{ flex: 1 }}
        >
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <ScrollView
                    className="flex-1 p-4"
                    contentContainerStyle={{ paddingBottom: 150, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mb-6">
                        <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Time Off
                        </Text>
                        <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Manage your leaves and requests
                        </Text>
                    </View>

                    {/* Submit Form */}
                    <GradientCard variant="surface" className="mb-6">
                        <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            New Request
                        </Text>

                        <View className="space-y-4">
                            <View>
                                <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Leave Type
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                    {leaveTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={{
                                                backgroundColor: selectedTypeId === type.id ? accentColor : (isDarkMode ? '#334155' : '#F1F5F9'),
                                                paddingHorizontal: 16,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                            }}
                                            onPress={() => setSelectedTypeId(type.id)}
                                        >
                                            <Text
                                                style={{
                                                    color: selectedTypeId === type.id ? 'white' : (isDarkMode ? '#E2E8F0' : '#475569'),
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {type.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        From Date
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDateFromPicker(true)}
                                        style={{
                                            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                            borderWidth: 1,
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                            borderRadius: 12,
                                            padding: 16,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Calendar size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} style={{ marginRight: 8 }} />
                                        <Text className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                                            {dateFrom.toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDateFromPicker && (
                                        <DateTimePicker
                                            value={dateFrom}
                                            mode="date"
                                            onChange={(event, date) => {
                                                setShowDateFromPicker(false);
                                                if (date) setDateFrom(date);
                                            }}
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        To Date
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDateToPicker(true)}
                                        style={{
                                            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                            borderWidth: 1,
                                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                            borderRadius: 12,
                                            padding: 16,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Calendar size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} style={{ marginRight: 8 }} />
                                        <Text className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                                            {dateTo.toLocaleDateString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDateToPicker && (
                                        <DateTimePicker
                                            value={dateTo}
                                            mode="date"
                                            onChange={(event, date) => {
                                                setShowDateToPicker(false);
                                                if (date) setDateTo(date);
                                            }}
                                        />
                                    )}
                                </View>
                            </View>

                            <GlassInput
                                label="Description (Optional)"
                                placeholder="Reason for time off..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                icon={<FileText size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} />}
                                style={{ height: 80, textAlignVertical: 'top' }}
                            />

                            <StyledButton
                                title="Submit Request"
                                onPress={handleSubmit}
                                loading={submitting}
                            />
                        </View>
                    </GradientCard>

                    {/* Previous Requests */}
                    <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        My Requests
                    </Text>
                    {loading ? (
                        <ActivityIndicator size="large" color={accentColor} />
                    ) : leaves.length === 0 ? (
                        <View className="items-center py-8">
                            <Clock size={48} color={isDarkMode ? '#334155' : '#CBD5E1'} />
                            <Text className={`mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                No requests found
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-3">
                            {leaves.map((leave) => (
                                <GradientCard key={leave.id} variant="secondary" className="mb-3">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View>
                                            <Text className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {leave.name}
                                            </Text>
                                            <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {leave.holiday_status_id[1]}
                                            </Text>
                                        </View>
                                        <View className={`px-2 py-1 rounded-full ${leave.state === 'validate' ? 'bg-emerald-500/10' :
                                            leave.state === 'refuse' ? 'bg-red-500/10' :
                                                'bg-yellow-500/10'
                                            }`}>
                                            <Text className={`text-xs font-bold ${getStateColor(leave.state)}`}>
                                                {leave.state.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-200/10">
                                        <View className="flex-row items-center">
                                            <Calendar size={14} color={isDarkMode ? '#94A3B8' : '#64748B'} style={{ marginRight: 4 }} />
                                            <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {new Date(leave.date_from).toLocaleDateString()} - {new Date(leave.date_to).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Text className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {leave.number_of_days} days
                                        </Text>
                                    </View>
                                </GradientCard>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
