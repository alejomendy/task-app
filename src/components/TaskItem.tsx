import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types/task';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
    const { isDark } = useTheme();

    const handleMenuPress = () => {
        Alert.alert(
            'Task Actions',
            'What would you like to do?',
            [
                {
                    text: 'Edit',
                    onPress: () => onEdit(task),
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Task',
                            'Are you sure you want to delete this task?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
                            ]
                        );
                    },
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const getCategoryStyles = () => {
        if (task.priority === 'high') {
            return {
                label: 'PRIORITY',
                container: 'bg-priority-bg text-priority-text',
            };
        }
        if (task.priority === 'medium') {
            return {
                label: 'WORK',
                container: 'bg-work-bg text-work-text',
            };
        }
        return {
            label: 'PERSONAL',
            container: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        };
    };

    const category = getCategoryStyles();
    const timeStr = task.dueDate
        ? new Date(task.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '09:00 AM';

    return (
        <View className="px-4 py-[6px]">
            <View className="flex-row items-center rounded-2xl p-4 border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-sm elevation-2">
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={() => onToggle(task.id)}
                    className="w-[22px] h-[22px] mr-3"
                >
                    {task.isCompleted ? (
                        <View className="w-[22px] h-[22px] rounded-full bg-primary items-center justify-center">
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                    ) : (
                        <View className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 dark:border-slate-600 bg-surface dark:bg-surface-dark" />
                    )}
                </TouchableOpacity>

                {/* Content */}
                <View className="flex-1">
                    <Text
                        className={`text-[15px] font-semibold mb-[6px] text-text-dark dark:text-text-dark-d ${task.isCompleted ? 'line-through text-slate-400 opacity-60' : ''
                            }`}
                    >
                        {task.title}
                    </Text>
                    <View className="flex-row items-center">
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="time-outline" size={14} color={isDark ? '#94A3B8' : '#6B7280'} />
                            <Text className="text-[12px] font-normal text-text-light dark:text-text-light-d">{timeStr}</Text>
                        </View>
                        <View className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-700 mx-2" />
                        <View className={`px-2 py-[3px] rounded-md ${category.container.split(' ').filter(c => c.startsWith('bg-')).join(' ')}`}>
                            <Text className={`text-[10px] font-bold tracking-tight ${category.container.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                                {category.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <TouchableOpacity onPress={handleMenuPress} className="p-2 ml-1">
                    <Ionicons name="ellipsis-horizontal" size={18} color={isDark ? '#475569' : '#D1D5DB'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};


