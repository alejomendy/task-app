import { DarkTheme, DefaultTheme, ThemeProvider as NavigationProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { TasksProvider } from '../src/contexts/TasksContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <NavigationProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <RootLayoutContent />
      </TasksProvider>
    </ThemeProvider>
  );
}
