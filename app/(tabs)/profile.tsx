import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';

export default function ProfileScreen() {
    const { theme, isDark, setTheme } = useTheme();
    const { tasks } = useTasks();

    const stats = React.useMemo(() => {
        const completed = tasks.filter(t => t.isCompleted).length;
        const pending = tasks.length - completed;
        return { completed, pending };
    }, [tasks]);

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#F5F5F5',
        },
        textDark: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        textMedium: {
            color: isDark ? '#E2E8F0' : '#374151',
        },
        textLight: {
            color: isDark ? '#94A3B8' : '#6B7280',
        },
        card: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#F3F4F6',
        }
    });

    return (
        <SafeAreaView style={dynamicStyles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source="https://i.pravatar.cc/150?img=33"
                            style={styles.avatar}
                            contentFit="cover"
                        />
                        <TouchableOpacity style={styles.cameraButton}>
                            <Ionicons name="camera" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.userName, dynamicStyles.textDark]}>Alex Johnson</Text>
                    <Text style={[styles.userRole, dynamicStyles.textLight]}>Product Designer</Text>
                </View>

                {/* Task Stats */}
                <View style={[styles.statsCard, dynamicStyles.card]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, dynamicStyles.textDark]}>{stats.pending}</Text>
                        <Text style={[styles.statLabel, dynamicStyles.textLight]}>Pending</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: isDark ? '#334155' : '#E5E7EB' }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, dynamicStyles.textDark]}>{stats.completed}</Text>
                        <Text style={[styles.statLabel, dynamicStyles.textLight]}>Completed</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, dynamicStyles.textLight]}>SETTINGS</Text>

                <View style={[styles.settingsGroup, dynamicStyles.card]}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1E1B4B' : '#DBEAFE' }]}>
                                <Ionicons name="moon" size={20} color="#3B82F6" />
                            </View>
                            <Text style={[styles.settingLabel, dynamicStyles.textDark]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1E1B4B' : '#DBEAFE' }]}>
                                <Ionicons name="notifications" size={20} color="#3B82F6" />
                            </View>
                            <Text style={[styles.settingLabel, dynamicStyles.textDark]}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748B' : '#9CA3AF'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1E1B4B' : '#DBEAFE' }]}>
                                <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
                            </View>
                            <Text style={[styles.settingLabel, dynamicStyles.textDark]}>Privacy & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748B' : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#3B82F6',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3B82F6',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
    },
    userRole: {
        fontSize: 14,
        marginTop: 4,
    },
    statsCard: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: '100%',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    settingsGroup: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: 32,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '700',
    },
});
