import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function TabLayout() {
    const { isDark } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderTopWidth: isDark ? 0 : 1,
                    borderTopColor: '#F3F4F6',
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                    paddingTop: 10,
                    elevation: 0,
                },
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="focus"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
