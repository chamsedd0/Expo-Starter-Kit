import React from 'react';
import { Tabs } from 'expo-router';
import { Calendar, DollarSign, User, FileText, Home } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { isDarkMode, accentColor } = useTheme();

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: isDarkMode ? '#94A3B8' : '#64748B',
                tabBarStyle: {
                    position: 'absolute',
                    // Float sufficiently above the home indicator
                    bottom: (Platform.OS === 'ios' ? 0 : 20) + insets.bottom - 20,
                    left: 20,
                    right: 20,
                    borderRadius: 40,
                    height: 70,
                    // Solid opaque background as requested ("not transparent at all")
                    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                    borderTopWidth: 1,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    paddingBottom: 0,
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    paddingTop: 7,
                    // Flex alignment for centering
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarItemStyle: {
                    height: 70, // Match bar height
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarShowLabel: true,
                // Remove transparent background logic since we want it solid
            }}
        >
            <Tabs.Screen
                name="requests"
                options={{
                    title: 'Requests',
                    tabBarIcon: ({ color, size }) => (
                        // Removed manual 'top' positioning to allow flexbox to center it
                        <View className="items-center justify-center w-12 h-12">
                            <FileText size={26} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center justify-center w-12 h-12">
                            <Home size={26} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center justify-center w-12 h-12">
                            <User size={26} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />

            {/* Hidden tabs for routing but not in bar */}
            <Tabs.Screen name="time-off" options={{ href: null }} />
            <Tabs.Screen name="expenses" options={{ href: null }} />
        </Tabs>
    );
}
