import React from 'react';
import { Tabs } from 'expo-router';
import { Calendar, DollarSign, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            initialRouteName="time-off"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    paddingBottom: 8 + insets.bottom,
                    paddingTop: 8,
                    height: 70 + insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    href: null, // Hide from tabs
                }}
            />
            <Tabs.Screen
                name="time-off"
                options={{
                    title: 'Time Off',
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: 'Expenses',
                    tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
