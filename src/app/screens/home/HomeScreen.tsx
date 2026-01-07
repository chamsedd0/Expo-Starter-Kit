import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/organisms/AppHeader';
import { PendingRequests } from '../../components/organisms/PendingRequests';
import { QuickLinksGrid } from '../../components/organisms/QuickLinksGrid';
import { RecentActivityLogs } from '../../components/organisms/RecentActivityLogs';

export function HomeScreen(): React.ReactElement {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { isDarkMode } = useTheme();

  const onRefresh = React.useCallback(async (): Promise<void> => {
    setRefreshing(true);
    // In a real app, this would trigger re-fetch in child components or context
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDarkMode ? '#ffffff' : '#000000'}
            />
          }
        >
          <View className="px-5">
            <AppHeader
              onSearch={(q) => console.log('Search:', q)}
              notificationCount={3}
            />

            <PendingRequests />

            <QuickLinksGrid />

            <RecentActivityLogs />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default HomeScreen;