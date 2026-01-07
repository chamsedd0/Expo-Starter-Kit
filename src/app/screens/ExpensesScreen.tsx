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
import { DollarSign, Tag, Calendar, FileText, ShoppingBag } from 'lucide-react-native';

interface Product {
    id: number;
    name: string;
    standard_price: number;
}

interface Expense {
    id: number;
    name: string;
    product_id: [number, string];
    price_unit: number;
    quantity: number;
    total_amount: number;
    date: string;
    state: string;
}

export default function ExpensesScreen() {
    const employee = useAuthStore((state) => state.employee);
    const { isDarkMode, accentColor } = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsRes, expensesRes] = await Promise.all([
                apiClient.getExpenseProducts(),
                employee ? apiClient.getExpenses(employee.id) : Promise.resolve({ expenses: [] }),
            ]);
            setProducts(productsRes.products);
            setExpenses(expensesRes.expenses);
            if (productsRes.products.length > 0) {
                setSelectedProductId(productsRes.products[0].id);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!employee || !selectedProductId || !description || !amount) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const amountNum = parseFloat(amount);
        const qtyNum = parseInt(quantity) || 1;

        if (isNaN(amountNum) || amountNum <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.createExpense({
                employee_id: employee.id,
                product_id: selectedProductId,
                name: description,
                unit_amount: amountNum,
                quantity: qtyNum,
                date: date.toISOString().split('T')[0],
            });
            Alert.alert('Success', 'Expense submitted!');
            setDescription('');
            setAmount('');
            setQuantity('1');
            await loadData();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'approved': return 'text-emerald-500';
            case 'done': return 'text-blue-500';
            case 'refused': return 'text-red-500';
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
                            Expenses
                        </Text>
                        <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Track and submit your expenses
                        </Text>
                    </View>

                    {/* Submit Form */}
                    <GradientCard variant="surface" className="mb-6">
                        <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            New Expense
                        </Text>

                        <View className="space-y-4">
                            <View>
                                <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Expense Category
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                    {products.map((product) => (
                                        <TouchableOpacity
                                            key={product.id}
                                            style={{
                                                backgroundColor: selectedProductId === product.id ? accentColor : (isDarkMode ? '#334155' : '#F1F5F9'),
                                                paddingHorizontal: 16,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                            }}
                                            onPress={() => setSelectedProductId(product.id)}
                                        >
                                            <Text
                                                style={{
                                                    color: selectedProductId === product.id ? 'white' : (isDarkMode ? '#E2E8F0' : '#475569'),
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {product.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <GlassInput
                                label="Description *"
                                placeholder="What is this expense for?"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={2}
                                icon={<FileText size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} />}
                                style={{ height: 60, textAlignVertical: 'top' }}
                            />

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <GlassInput
                                        label="Amount *"
                                        placeholder="0.00"
                                        value={amount}
                                        onChangeText={setAmount}
                                        keyboardType="numeric"
                                        icon={<DollarSign size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />}
                                    />
                                </View>
                                <View className="flex-1">
                                    <GlassInput
                                        label="Quantity"
                                        placeholder="1"
                                        value={quantity}
                                        onChangeText={setQuantity}
                                        keyboardType="numeric"
                                        icon={<Tag size={18} color={isDarkMode ? '#94A3B8' : '#64748B'} />}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Date
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
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
                                        {date.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) setDate(selectedDate);
                                        }}
                                    />
                                )}
                            </View>

                            <StyledButton
                                title="Submit Expense"
                                onPress={handleSubmit}
                                loading={submitting}
                            />
                        </View>
                    </GradientCard>

                    {/* Previous Expenses */}
                    <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        My Expenses
                    </Text>
                    {loading ? (
                        <ActivityIndicator size="large" color={accentColor} />
                    ) : expenses.length === 0 ? (
                        <View className="items-center py-8">
                            <ShoppingBag size={48} color={isDarkMode ? '#334155' : '#CBD5E1'} />
                            <Text className={`mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                No expenses yet
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-3">
                            {expenses.map((expense) => (
                                <GradientCard key={expense.id} variant="secondary" className="mb-3">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View style={{ flex: 1, marginRight: 8 }}>
                                            <Text className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`} numberOfLines={1}>
                                                {expense.name}
                                            </Text>
                                            <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {expense.product_id[1]}
                                            </Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                ${expense.total_amount.toFixed(2)}
                                            </Text>
                                            <View className={`px-2 py-0.5 rounded-full mt-1 ${expense.state === 'approved' || expense.state === 'done' ? 'bg-emerald-500/10' :
                                                expense.state === 'refused' ? 'bg-red-500/10' :
                                                    'bg-yellow-500/10'
                                                }`}>
                                                <Text className={`text-[10px] font-bold ${getStateColor(expense.state)}`}>
                                                    {expense.state.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-200/10">
                                        <View className="flex-row items-center">
                                            <Calendar size={14} color={isDarkMode ? '#94A3B8' : '#64748B'} style={{ marginRight: 4 }} />
                                            <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {new Date(expense.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Text className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Qty: {expense.quantity}
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
