import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, UserIcon, SettingsIcon, FlaskConicalIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import TestScreen from '../screens/TestScreen';
import { useTheme } from '../contexts/ThemeContext';

type BottomTabParamList = {
  Home: undefined;
  Test: undefined;
  Profile: undefined;
  Settings: {
    bottomMenuEnabled?: boolean;
    onBottomMenuToggle?: (value: boolean) => void;
  };
};

interface BottomTabNavigationProps {
  bottomMenuEnabled: boolean;
  onBottomMenuToggle: (value: boolean) => void;
}

export function BottomTabNavigation({
  bottomMenuEnabled,
  onBottomMenuToggle
}: BottomTabNavigationProps) {
  const Tab = createBottomTabNavigator<BottomTabParamList>();
  const { isDarkMode, accentColor } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon color={color} size={size} />;
            case 'Test':
              return <FlaskConicalIcon color={color} size={size} />;
            case 'Profile':
              return <UserIcon color={color} size={size} />;
            case 'Settings':
              return <SettingsIcon color={color} size={size} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1F2937' : 'white',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          color: isDarkMode ? '#D1D5DB' : 'black',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          title: 'Test',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{
          bottomMenuEnabled,
          onBottomMenuToggle
        }}
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigation;