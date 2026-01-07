import React from 'react';
import "../global.css";
import { Stack } from "expo-router";
import { NetworkProvider } from '../app/contexts/NetworkContext';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import { I18nProvider } from '../app/contexts/I18nContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <NetworkProvider>
          <ThemeProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 300,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                presentation: 'card',
                contentStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Stack.Screen name="login" />
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </ThemeProvider>
        </NetworkProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
