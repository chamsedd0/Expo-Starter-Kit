import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useStore';
import { apiClient } from '../../api/client';
import DateTimePicker from '@react-native-community/datetimepicker';

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
            case 'validate': return 'text-green-600';
            case 'confirm': return 'text-blue-600';
            case 'refuse': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 p-4">
                {/* Submit Form */}
                <View className="bg-card rounded-lg p-6 mb-4">
                    <Text className="text-2xl font-bold text-foreground mb-4">Request Time Off</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Leave Type</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {leaveTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        className={`px-4 py-2 rounded-lg border ${selectedTypeId === type.id
                                            ? 'bg-primary border-primary'
                                            : 'bg-background border-border'
                                            }`}
                                        onPress={() => setSelectedTypeId(type.id)}
                                    >
                                        <Text
                                            className={
                                                selectedTypeId === type.id
                                                    ? 'text-primary-foreground font-semibold'
                                                    : 'text-foreground'
                                            }
                                        >
                                            {type.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">From Date</Text>
                            <TouchableOpacity
                                className="bg-background border border-border rounded-lg px-4 py-3"
                                onPress={() => setShowDateFromPicker(true)}
                            >
                                <Text className="text-foreground">{dateFrom.toLocaleDateString()}</Text>
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

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">To Date</Text>
                            <TouchableOpacity
                                className="bg-background border border-border rounded-lg px-4 py-3"
                                onPress={() => setShowDateToPicker(true)}
                            >
                                <Text className="text-foreground">{dateTo.toLocaleDateString()}</Text>
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

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Description (Optional)</Text>
                            <TextInput
                                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                                placeholder="Reason for time off..."
                                placeholderTextColor="#888"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <TouchableOpacity
                            className={`py-3 px-6 rounded-lg ${submitting ? 'bg-muted' : 'bg-primary'}`}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-primary-foreground font-semibold text-center">
                                    Submit Request
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Previous Requests */}
                <View className="bg-card rounded-lg p-6">
                    <Text className="text-xl font-bold text-foreground mb-4">My Requests</Text>
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : leaves.length === 0 ? (
                        <Text className="text-muted-foreground text-center py-4">No requests yet</Text>
                    ) : (
                        leaves.map((leave) => (
                            <View key={leave.id} className="bg-background rounded-lg p-4 mb-3">
                                <Text className="text-foreground font-semibold">{leave.name}</Text>
                                <Text className="text-sm text-muted-foreground">
                                    {leave.holiday_status_id[1]}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    {new Date(leave.date_from).toLocaleDateString()} -{' '}
                                    {new Date(leave.date_to).toLocaleDateString()}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    {leave.number_of_days} day(s)
                                </Text>
                                <Text className={`text-sm font-semibold mt-1 ${getStateColor(leave.state)}`}>
                                    {leave.state.toUpperCase()}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
