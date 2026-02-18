import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
            <View className="flex-row justify-between items-center px-4 py-4">
                <Text className="text-[28px] font-bold text-text-dark dark:text-text-dark-d">Calendar</Text>
                <TouchableOpacity
                    className="px-4 py-2 bg-primary rounded-xl"
                    onPress={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                    }}
                >
                    <Text className="text-sm font-semibold text-white">Today</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center px-4 py-4">
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        className="w-10 h-10 rounded-full items-center justify-center bg-bg-light dark:bg-bg-light-dark"
                    >
                        <Ionicons name="chevron-back" size={24} color={isDark ? '#94A3B8' : '#374151'} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-text-dark dark:text-text-dark-d">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        className="w-10 h-10 rounded-full items-center justify-center bg-bg-light dark:bg-bg-light-dark"
                    >
                        <Ionicons name="chevron-forward" size={24} color={isDark ? '#94A3B8' : '#374151'} />
                    </TouchableOpacity>
                </View>

                <View className="mx-4 rounded-2xl p-4 border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-2">
                    <View className="flex-row mb-2">
                        {DAYS.map(day => (
                            <View key={day} className="flex-1 items-center py-2">
                                <Text className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="flex-row flex-wrap">
                        {days.map((date, index) => {
                            const selected = isSelected(date);
                            const today = isToday(date);
                            const hasTask = hasTasksOnDate(date);

                            return (
                                <TouchableOpacity
                                    key={index}
                                    className={`w-[14.28%] aspect-square items-center justify-center rounded-xl my-[2px] ${selected ? 'bg-primary' : (today ? 'bg-blue-100 dark:bg-indigo-950' : 'bg-transparent')
                                        }`}
                                    onPress={() => date && setSelectedDate(date)}
                                    disabled={!date}
                                >
                                    {date && (
                                        <>
                                            <Text className={`text-sm font-medium ${selected ? 'text-white font-bold' : (today ? 'text-primary' : 'text-text-dark dark:text-text-dark-d')
                                                }`}>
                                                {date.getDate()}
                                            </Text>
                                            {hasTask && (
                                                <View className={`w-1 h-1 rounded-full mt-[2px] ${selected ? 'bg-white' : 'bg-primary'
                                                    }`} />
                                            )}
                                        </>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View className="mt-6 px-4 pb-[100px]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-text-dark dark:text-text-dark-d">
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text className="text-sm font-semibold text-text-light dark:text-text-light-d">
                            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
                        </Text>
                    </View>

                    {selectedDateTasks.length === 0 ? (
                        <View className="items-center py-12">
                            <Ionicons name="calendar-outline" size={48} color={isDark ? '#1E293B' : '#E5E7EB'} />
                            <Text className="text-sm mt-3 text-slate-400 dark:text-slate-600">No tasks for this day</Text>
                        </View>
                    ) : (
                        <View className="gap-2">
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
