import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskForm } from '../../src/components/TaskForm';
import { TaskItem } from '../../src/components/TaskItem';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { Task } from '../../src/types/task';

export default function ProgressScreen() {
    const { tasks, toggleComplete, deleteTask, updateTask } = useTasks();
    const { isDark } = useTheme();
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.isCompleted).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        const today = new Date();
        const todayTasks = tasks.filter(t => {
            if (!t.dueDate) return true;
            const taskDate = new Date(t.dueDate);
            return taskDate.toDateString() === today.toDateString();
        });
        const todayCompleted = todayTasks.filter(t => t.isCompleted).length;

        return {
            total,
            completed,
            percentage,
            todayTotal: todayTasks.length,
            todayCompleted,
        };
    }, [tasks]);

    const completedTasks = useMemo(() => {
        return tasks.filter(t => t.isCompleted).slice(0, 10);
    }, [tasks]);

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (title: string, description: string, priority: Task['priority'], dueDate?: Date) => {
        if (editingTask) {
            await updateTask({
                ...editingTask,
                title,
                description,
                priority,
                dueDate: dueDate?.toISOString()
            });
        }
        setIsFormVisible(false);
        setEditingTask(undefined);
    };

    const dynamicStyles = {
        container: {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        headerTitle: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        circleOuter: {
            backgroundColor: isDark ? '#1E293B' : '#E5E7EB',
        },
        circleInner: {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        percentageText: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        statsText: {
            color: isDark ? '#94A3B8' : '#6B7280',
        },
        card: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#F3F4F6',
        },
        statLabel: {
            color: isDark ? '#94A3B8' : '#6B7280',
        },
        statValueGeneral: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        divider: {
            backgroundColor: isDark ? '#334155' : '#E5E7EB',
        },
        sectionTitle: {
            color: isDark ? '#94A3B8' : '#6B7280',
        },
        emptyText: {
            color: isDark ? '#475569' : '#9CA3AF',
        }
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Progress</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Progress Circle */}
                <View style={styles.progressSection}>
                    <View style={[styles.circleOuter, dynamicStyles.circleOuter]}>
                        <View style={[styles.circleInner, dynamicStyles.circleInner]}>
                            <Text style={[styles.percentageText, dynamicStyles.percentageText]}>{stats.percentage}%</Text>
                            <Text style={styles.doneText}>DONE</Text>
                        </View>
                    </View>
                    <Text style={[styles.statsText, dynamicStyles.statsText]}>
                        {stats.completed} of {stats.total} tasks completed
                    </Text>
                </View>

                {/* Today Stats */}
                <View style={[styles.statsCard, dynamicStyles.card]}>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.todayCompleted}</Text>
                            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Completed Today</Text>
                        </View>
                        <View style={[styles.statDivider, dynamicStyles.divider]} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.todayTotal - stats.todayCompleted}</Text>
                            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Remaining Today</Text>
                        </View>
                    </View>
                </View>

                {/* Overall Stats */}
                <View style={styles.overallStatsContainer}>
                    <View style={[styles.smallStatCard, dynamicStyles.card]}>
                        <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                        <Text style={[styles.statCardValue, dynamicStyles.statValueGeneral]}>{stats.completed}</Text>
                        <Text style={[styles.statCardLabel, dynamicStyles.statLabel]}>Completed</Text>
                    </View>
                    <View style={[styles.smallStatCard, dynamicStyles.card]}>
                        <Ionicons name="time" size={32} color="#F59E0B" />
                        <Text style={[styles.statCardValue, dynamicStyles.statValueGeneral]}>{stats.total - stats.completed}</Text>
                        <Text style={[styles.statCardLabel, dynamicStyles.statLabel]}>Pending</Text>
                    </View>
                    <View style={[styles.smallStatCard, dynamicStyles.card]}>
                        <Ionicons name="list" size={32} color="#3B82F6" />
                        <Text style={[styles.statCardValue, dynamicStyles.statValueGeneral]}>{stats.total}</Text>
                        <Text style={[styles.statCardLabel, dynamicStyles.statLabel]}>Total</Text>
                    </View>
                </View>

                {/* Completed Tasks */}
                <View style={styles.completedSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>RECENTLY COMPLETED</Text>
                        {completedTasks.length > 0 && (
                            <TouchableOpacity>
                                <Text style={styles.clearAllText}>Clear all</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {completedTasks.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? '#1E293B' : '#E5E7EB'} />
                            <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No completed tasks yet</Text>
                            <Text style={styles.emptySubtext}>Complete tasks to see them here</Text>
                        </View>
                    ) : (
                        <View style={styles.tasksList}>
                            {completedTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleComplete}
                                    onDelete={deleteTask}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <TaskForm
                visible={isFormVisible}
                onClose={() => {
                    setIsFormVisible(false);
                    setEditingTask(undefined);
                }}
                initialTask={editingTask}
                onSubmit={handleFormSubmit}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    progressSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    circleOuter: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleInner: {
        width: 156,
        height: 156,
        borderRadius: 78,
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontSize: 48,
        fontWeight: '700',
    },
    doneText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1,
        marginTop: 4,
    },
    statsText: {
        fontSize: 14,
        marginTop: 16,
    },
    statsCard: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#3B82F6',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
    },
    overallStatsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    smallStatCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    statCardValue: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 8,
    },
    statCardLabel: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'center',
    },
    completedSection: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    clearAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
    },
    tasksList: {
        gap: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 12,
        color: '#D1D5DB',
        marginTop: 4,
    },
});
