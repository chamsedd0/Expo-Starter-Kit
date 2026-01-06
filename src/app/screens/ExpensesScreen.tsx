import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useStore';
import { apiClient } from '../../api/client';
import DateTimePicker from '@react-native-community/datetimepicker';

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
            case 'approved': return 'text-green-600';
            case 'done': return 'text-blue-600';
            case 'refused': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 p-4">
                {/* Submit Form */}
                <View className="bg-card rounded-lg p-6 mb-4">
                    <Text className="text-2xl font-bold text-foreground mb-4">Submit Expense</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Expense Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                {products.map((product) => (
                                    <TouchableOpacity
                                        key={product.id}
                                        className={`px-4 py-2 rounded-lg border ${selectedProductId === product.id
                                            ? 'bg-primary border-primary'
                                            : 'bg-background border-border'
                                            }`}
                                        onPress={() => setSelectedProductId(product.id)}
                                    >
                                        <Text
                                            className={
                                                selectedProductId === product.id
                                                    ? 'text-primary-foreground font-semibold'
                                                    : 'text-foreground'
                                            }
                                        >
                                            {product.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Description *</Text>
                            <TextInput
                                className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                                placeholder="What is this expense for?"
                                placeholderTextColor="#888"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={2}
                            />
                        </View>

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-foreground mb-2">Amount *</Text>
                                <TextInput
                                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                                    placeholder="0.00"
                                    placeholderTextColor="#888"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-foreground mb-2">Quantity</Text>
                                <TextInput
                                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                                    placeholder="1"
                                    placeholderTextColor="#888"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Date</Text>
                            <TouchableOpacity
                                className="bg-background border border-border rounded-lg px-4 py-3"
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text className="text-foreground">{date.toLocaleDateString()}</Text>
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

                        <TouchableOpacity
                            className={`py-3 px-6 rounded-lg ${submitting ? 'bg-muted' : 'bg-primary'}`}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-primary-foreground font-semibold text-center">
                                    Submit Expense
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Previous Expenses */}
                <View className="bg-card rounded-lg p-6">
                    <Text className="text-xl font-bold text-foreground mb-4">My Expenses</Text>
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : expenses.length === 0 ? (
                        <Text className="text-muted-foreground text-center py-4">No expenses yet</Text>
                    ) : (
                        expenses.map((expense) => (
                            <View key={expense.id} className="bg-background rounded-lg p-4 mb-3">
                                <Text className="text-foreground font-semibold">{expense.name}</Text>
                                <Text className="text-sm text-muted-foreground">
                                    {expense.product_id[1]}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    Date: {new Date(expense.date).toLocaleDateString()}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    Qty: {expense.quantity} × ${expense.price_unit.toFixed(2)} = $
                                    {expense.total_amount.toFixed(2)}
                                </Text>
                                <Text className={`text-sm font-semibold mt-1 ${getStateColor(expense.state)}`}>
                                    {expense.state.toUpperCase()}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
