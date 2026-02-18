import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskForm } from '../../src/components/TaskForm';
import { TaskItem } from '../../src/components/TaskItem';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { Task } from '../../src/types/task';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
    const { tasks, toggleComplete, deleteTask, updateTask } = useTasks();
    const { isDark } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const changeMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date | null) => {
        if (!date) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const getTasksForSelectedDate = () => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === selectedDate.toDateString();
        });
    };

    const hasTasksOnDate = (date: Date | null) => {
        if (!date) return false;
        return tasks.some(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

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

    const days = getDaysInMonth(currentDate);
    const selectedDateTasks = getTasksForSelectedDate();

    const dynamicStyles = {
        container: {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        headerTitle: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        monthText: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        navButton: {
            backgroundColor: isDark ? '#1E293B' : '#F3F4F6',
        },
        calendarCard: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#F3F4F6',
        },
        dayCell: (date: Date | null) => ({
            backgroundColor: isSelected(date)
                ? '#3B82F6'
                : (isToday(date) ? (isDark ? '#1E3A8A' : '#DBEAFE') : 'transparent'),
        }),
        dayText: (date: Date | null) => ({
            color: isSelected(date)
                ? '#FFFFFF'
                : (isToday(date) ? '#3B82F6' : (isDark ? '#E2E8F0' : '#374151')),
        }),
        sectionTitle: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        countText: {
            color: isDark ? '#94A3B8' : '#6B7280',
        }
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Calendar</Text>
                <TouchableOpacity
                    style={styles.todayButton}
                    onPress={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                    }}
                >
                    <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={[styles.navButton, dynamicStyles.navButton]}>
                        <Ionicons name="chevron-back" size={24} color={isDark ? '#94A3B8' : '#374151'} />
                    </TouchableOpacity>
                    <Text style={[styles.monthText, dynamicStyles.monthText]}>
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={[styles.navButton, dynamicStyles.navButton]}>
                        <Ionicons name="chevron-forward" size={24} color={isDark ? '#94A3B8' : '#374151'} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.calendarCard, dynamicStyles.calendarCard]}>
                    <View style={styles.dayHeaderRow}>
                        {DAYS.map(day => (
                            <View key={day} style={styles.dayHeader}>
                                <Text style={styles.dayHeaderText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {days.map((date, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCell,
                                    dynamicStyles.dayCell(date),
                                    !date && styles.emptyCell,
                                ]}
                                onPress={() => date && setSelectedDate(date)}
                                disabled={!date}
                            >
                                {date && (
                                    <>
                                        <Text style={[
                                            styles.dayText,
                                            dynamicStyles.dayText(date),
                                            isSelected(date) && styles.selectedDayText,
                                        ]}>
                                            {date.getDate()}
                                        </Text>
                                        {hasTasksOnDate(date) && (
                                            <View style={[
                                                styles.taskDot,
                                                isSelected(date) && styles.taskDotSelected,
                                            ]} />
                                        )}
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.tasksSection}>
                    <View style={styles.tasksSectionHeader}>
                        <Text style={[styles.tasksSectionTitle, dynamicStyles.sectionTitle]}>
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text style={[styles.tasksCount, dynamicStyles.countText]}>
                            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
                        </Text>
                    </View>

                    {selectedDateTasks.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={48} color={isDark ? '#1E293B' : '#E5E7EB'} />
                            <Text style={styles.emptyStateText}>No tasks for this day</Text>
                        </View>
                    ) : (
                        <View style={styles.tasksList}>
                            {selectedDateTasks.map(task => (
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
    },
    todayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '700',
    },
    calendarCard: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    dayHeaderRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeader: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    dayHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginVertical: 2,
    },
    emptyCell: {
        backgroundColor: 'transparent',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedDayText: {
        fontWeight: '700',
    },
    taskDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
        marginTop: 2,
    },
    taskDotSelected: {
        backgroundColor: '#FFFFFF',
    },
    tasksSection: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    tasksSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tasksSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    tasksCount: {
        fontSize: 14,
        fontWeight: '600',
    },
    tasksList: {
        gap: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 12,
    },
});
