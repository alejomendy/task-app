import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';

export default function ProfileScreen() {
    const { isDark, setTheme } = useTheme();
    const { tasks } = useTasks();
    const { user, signOut } = useAuth();

    const stats = React.useMemo(() => {
        const completed = tasks.filter(t => t.isCompleted).length;
        const pending = tasks.length - completed;
        return { completed, pending };
    }, [tasks]);

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Profile Header */}
                <View className="items-center py-10">
                    <View className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary elevation-8 mb-4">
                        <Ionicons name="person" size={50} color="white" />
                    </View>
                    <Text className="text-2xl font-bold text-text-dark dark:text-text-dark-d mb-1">
                        {user?.email?.split('@')[0] || 'User Profile'}
                    </Text>
                    <Text className="text-text-light dark:text-text-light-d">
                        {user?.email || 'Not logged in'}
                    </Text>
                </View>

                {/* Task Stats */}
                <View className="flex-row rounded-[20px] p-6 border border-border dark:border-border-dark mb-8 bg-surface dark:bg-surface-dark shadow-sm elevation-2">
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-bold text-text-dark dark:text-text-dark-d">{stats.pending}</Text>
                        <Text className="text-xs mt-1 font-semibold text-text-light dark:text-text-light-d">Pending</Text>
                    </View>
                    <View className="w-px h-full bg-border dark:bg-border-dark mx-4" />
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-bold text-text-dark dark:text-text-dark-d">{stats.completed}</Text>
                        <Text className="text-xs mt-1 font-semibold text-text-light dark:text-text-light-d">Completed</Text>
                    </View>
                </View>

                <Text className="text-[12px] font-bold tracking-widest mb-3 ml-1 text-text-light dark:text-text-light-d">SETTINGS</Text>

                <View className="rounded-[20px] border border-border dark:border-border-dark overflow-hidden bg-surface dark:bg-surface-dark">
                    <View className="flex-row items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                        <View className="flex-row items-center">
                            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-blue-100 dark:bg-indigo-950">
                                <Ionicons name="moon" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-base font-semibold text-text-dark dark:text-text-dark-d">Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                        <View className="flex-row items-center">
                            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-blue-100 dark:bg-indigo-950">
                                <Ionicons name="notifications" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-base font-semibold text-text-dark dark:text-text-dark-d">Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748B' : '#9CA3AF'} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between p-4">
                        <View className="flex-row items-center">
                            <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-blue-100 dark:bg-indigo-950">
                                <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
                            </View>
                            <Text className="text-base font-semibold text-text-dark dark:text-text-dark-d">Privacy & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748B' : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>

                {/* Sign Out */}
                <TouchableOpacity
                    className="flex-row items-center p-4 bg-surface dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark mt-8"
                    onPress={signOut}
                >
                    <View className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 items-center justify-center mr-4">
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-red-500">Sign Out</Text>
                    <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
