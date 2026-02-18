import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
            <View className="px-4 py-4">
                <Text className="text-[28px] font-bold text-text-dark dark:text-text-dark-d">Progress</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Progress Circle */}
                <View className="items-center py-8">
                    <View className="w-[180px] h-[180px] rounded-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                        <View className="w-[156px] h-[156px] rounded-full items-center justify-center bg-surface dark:bg-background-dark">
                            <Text className="text-5xl font-bold text-text-dark dark:text-text-dark-d">{stats.percentage}%</Text>
                            <Text className="text-[12px] font-bold text-slate-500 tracking-widest mt-1">DONE</Text>
                        </View>
                    </View>
                    <Text className="text-sm mt-4 text-text-light dark:text-text-light-d">
                        {stats.completed} of {stats.total} tasks completed
                    </Text>
                </View>

                {/* Today Stats */}
                <View className="mx-4 rounded-2xl p-5 border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-2">
                    <View className="flex-row items-center">
                        <View className="flex-1 items-center">
                            <Text className="text-[32px] font-bold text-primary">{stats.todayCompleted}</Text>
                            <Text className="text-[12px] mt-1 text-text-light dark:text-text-light-d">Completed Today</Text>
                        </View>
                        <View className="w-px h-10 bg-border dark:bg-border-dark" />
                        <View className="flex-1 items-center">
                            <Text className="text-[32px] font-bold text-primary">{Math.max(0, stats.todayTotal - stats.todayCompleted)}</Text>
                            <Text className="text-[12px] mt-1 text-text-light dark:text-text-light-d">Remaining Today</Text>
                        </View>
                    </View>
                </View>

                {/* Overall Stats */}
                <View className="flex-row px-4 mt-4 gap-3">
                    <View className="flex-1 rounded-xl p-4 items-center border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-1">
                        <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                        <Text className="text-2xl font-bold mt-2 text-text-dark dark:text-text-dark-d">{stats.completed}</Text>
                        <Text className="text-[10px] mt-1 text-center text-text-light dark:text-text-light-d">Completed</Text>
                    </View>
                    <View className="flex-1 rounded-xl p-4 items-center border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-1">
                        <Ionicons name="time" size={32} color="#F59E0B" />
                        <Text className="text-2xl font-bold mt-2 text-text-dark dark:text-text-dark-d">{stats.total - stats.completed}</Text>
                        <Text className="text-[10px] mt-1 text-center text-text-light dark:text-text-light-d">Pending</Text>
                    </View>
                    <View className="flex-1 rounded-xl p-4 items-center border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-1">
                        <Ionicons name="list" size={32} color="#3B82F6" />
                        <Text className="text-2xl font-bold mt-2 text-text-dark dark:text-text-dark-d">{stats.total}</Text>
                        <Text className="text-[10px] mt-1 text-center text-text-light dark:text-text-light-d">Total</Text>
                    </View>
                </View>

                {/* Completed Tasks */}
                <View className="mt-6 px-4 pb-[100px]">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-[11px] font-bold tracking-wider text-text-light dark:text-text-light-d">RECENTLY COMPLETED</Text>
                        {completedTasks.length > 0 && (
                            <TouchableOpacity>
                                <Text className="text-sm font-semibold text-primary">Clear all</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {completedTasks.length === 0 ? (
                        <View className="items-center py-12">
                            <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? '#1E293B' : '#E5E7EB'} />
                            <Text className="text-sm font-medium mt-3 text-text-light dark:text-text-light-d">No completed tasks yet</Text>
                            <Text className="text-[12px] text-slate-400 dark:text-slate-600 mt-1">Complete tasks to see them here</Text>
                        </View>
                    ) : (
                        <View className="gap-2">
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
