import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../store/useStore';
import { useTheme } from '../../contexts/ThemeContext';
import { GradientCard } from '../../components/ui/GradientCard';
import { StyledButton } from '../../components/ui/StyledButton';
import { User, Mail, Briefcase, Award, LogOut, ChevronRight, Settings, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { employee, logout } = useAuthStore();
  const { isDarkMode, accentColor } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <View className="flex-row items-center py-3 border-b border-gray-100/10 last:border-0">
      <View className={`p-2 rounded-full mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </Text>
        <Text className={`text-base font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          {value}
        </Text>
      </View>
    </View>
  );

  const SettingRow = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-gray-100/10 active:opacity-70"
    >
      <View className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {icon}
      </View>
      <Text className={`flex-1 text-base font-meduim ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
        {label}
      </Text>
      <ChevronRight size={20} color={isDarkMode ? '#64748B' : '#94A3B8'} />
    </TouchableOpacity>
  );

  if (!employee) return null;

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#F1F5F9']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Profile
            </Text>
            <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage your account and settings
            </Text>
          </View>

          <View className="items-center mb-8">
            <View
              className="mb-4 rounded-full p-1"
              style={{
                backgroundColor: accentColor,
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10
              }}
            >
              <View className={`p-4 rounded-full border-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <User size={64} color={accentColor} />
              </View>
            </View>
            <Text className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {employee.name}
            </Text>
            <Text className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {employee.job_title}
            </Text>
          </View>

          <View className="mb-6">
            <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Employee Information
            </Text>
            <GradientCard variant="surface" className="p-0 overflow-hidden">
              <View className="p-4">
                <InfoRow
                  icon={<Award size={18} color={accentColor} />}
                  label="Employee ID"
                  value={employee.id.toString()}
                />
                <InfoRow
                  icon={<Briefcase size={18} color={accentColor} />}
                  label="Department"
                  value={employee.department || 'N/A'}
                />
                <InfoRow
                  icon={<Mail size={18} color={accentColor} />}
                  label="Job Title"
                  value={employee.job_title}
                />
              </View>
            </GradientCard>
          </View>

          <View className="mb-8">
            <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Preferences
            </Text>
            <GradientCard variant="surface" className="px-4 py-0">
              <SettingRow
                icon={<Settings size={20} color={isDarkMode ? '#CBD5E1' : '#475569'} />}
                label="App Settings"
                onPress={() => Alert.alert('Coming Soon', 'Settings will be available in a future update.')}
              />
              <SettingRow
                icon={<Shield size={20} color={isDarkMode ? '#CBD5E1' : '#475569'} />}
                label="Privacy & Security"
                onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available in a future update.')}
              />
            </GradientCard>
          </View>

          <StyledButton
            title="Log Out"
            variant="danger"
            onPress={handleLogout}
            icon={<LogOut size={20} color="white" />}
          />

          <Text className={`text-center mt-8 text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Version 1.0.0 • Build 2024
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}