import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

    const getCategoryInfo = () => {
        if (task.priority === 'high') {
            return {
                label: 'PRIORITY',
                bgColor: isDark ? '#7C2D12' : '#FED7AA',
                textColor: isDark ? '#FB923C' : '#EA580C'
            };
        }
        if (task.priority === 'medium') {
            return {
                label: 'WORK',
                bgColor: isDark ? '#1E3A8A' : '#DBEAFE',
                textColor: isDark ? '#60A5FA' : '#2563EB'
            };
        }
        return {
            label: 'PERSONAL',
            bgColor: isDark ? '#064E3B' : '#D1FAE5',
            textColor: isDark ? '#34D399' : '#059669'
        };
    };

    const category = getCategoryInfo();
    const timeStr = task.dueDate
        ? new Date(task.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '09:00 AM';

    const cardStyles = {
        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#F3F4F6',
    };

    const textStyles = {
        title: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        time: {
            color: isDark ? '#94A3B8' : '#6B7280',
        }
    };

    return (
        <View style={styles.cardContainer}>
            <View style={[styles.card, cardStyles]}>
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={() => onToggle(task.id)}
                    style={styles.checkboxContainer}
                >
                    {task.isCompleted ? (
                        <View style={styles.checkboxChecked}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                    ) : (
                        <View style={[styles.checkboxUnchecked, { borderColor: isDark ? '#475569' : '#D1D5DB', backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]} />
                    )}
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <Text
                        style={[
                            styles.title,
                            textStyles.title,
                            task.isCompleted && styles.titleCompleted
                        ]}
                    >
                        {task.title}
                    </Text>
                    <View style={styles.metaRow}>
                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={14} color={isDark ? '#94A3B8' : '#6B7280'} />
                            <Text style={[styles.time, textStyles.time]}>{timeStr}</Text>
                        </View>
                        <View style={[styles.dotSeparator, { backgroundColor: isDark ? '#334155' : '#D1D5DB' }]} />
                        <View style={[styles.tag, { backgroundColor: category.bgColor }]}>
                            <Text style={[styles.tagText, { color: category.textColor }]}>
                                {category.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={18} color={isDark ? '#475569' : '#D1D5DB'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
    },
    checkboxContainer: {
        width: 22,
        height: 22,
        marginRight: 12,
    },
    checkboxUnchecked: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
    },
    checkboxChecked: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
        opacity: 0.6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    time: {
        fontSize: 12,
        fontWeight: '400',
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        marginHorizontal: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    menuButton: {
        padding: 8,
        marginLeft: 4,
    },
});
