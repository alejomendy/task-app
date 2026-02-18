import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { supabase } from '../src/lib/supabase';

export default function AuthScreen() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.replace('/(tabs)');
            } else {
                const redirectTo = Linking.createURL('/auth');
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectTo,
                    }
                });
                if (error) throw error;
                Alert.alert('Success', 'Check your email for the confirmation link!');
                setMode('login');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-background dark:bg-background-dark"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 px-8 pt-20 pb-10 justify-center">
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center shadow-lg shadow-primary elevation-8 mb-6">
                            <Ionicons name="checkbox" size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-text-dark dark:text-text-dark-d mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </Text>
                        <Text className="text-text-light dark:text-text-light-d text-center">
                            {mode === 'login'
                                ? 'Sign in to sync your tasks'
                                : 'Join us to stay organized across devices'}
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase px-1">Email</Text>
                            <View className="flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl px-4 py-3">
                                <Ionicons name="mail-outline" size={20} color={isDark ? '#94A3B8' : '#6B7280'} style={{ marginRight: 12 }} />
                                <TextInput
                                    className="flex-1 text-text-dark dark:text-text-dark-d"
                                    placeholder="your@email.com"
                                    placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase px-1">Password</Text>
                            <View className="flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl px-4 py-3">
                                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#94A3B8' : '#6B7280'} style={{ marginRight: 12 }} />
                                <TextInput
                                    className="flex-1 text-text-dark dark:text-text-dark-d"
                                    placeholder="min. 6 characters"
                                    placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-primary rounded-2xl py-4 mt-10 items-center shadow-lg shadow-primary elevation-4"
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-text-light dark:text-text-light-d">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        </Text>
                        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                            <Text className="text-primary font-bold">
                                {mode === 'login' ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
