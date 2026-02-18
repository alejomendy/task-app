import { DarkTheme, DefaultTheme, ThemeProvider as NavigationProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Suppress expo-notifications error in Expo Go on Android
if (__DEV__ && Platform.OS === 'android') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Android Push notifications')) {
      return console.warn(...args);
    }
    originalError.apply(console, args);
  };
}

import { AuthProvider } from '../src/contexts/AuthContext';
import { TasksProvider } from '../src/contexts/TasksContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';

function RootLayoutContent() {
  const { isDark } = useTheme();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/auth');
    }
  }, [session, authLoading]);

  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TasksProvider>
          <RootLayoutContent />
        </TasksProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
