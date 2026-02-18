import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Task } from '../types/task';

interface TaskFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string, priority: Task['priority'], dueDate?: Date) => void;
    initialTask?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({ visible, onClose, onSubmit, initialTask }) => {
    const { isDark } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (initialTask && visible) {
            setTitle(initialTask.title);
            setDescription(initialTask.description || '');
            setPriority(initialTask.priority);
            setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : undefined);
        } else if (!initialTask && visible) {
            resetFields();
        }
    }, [initialTask, visible]);

    const resetFields = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate(undefined);
    };

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit(title, description, priority, dueDate);
        onClose();
    };

    const openDatePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: dueDate || new Date(),
                mode: 'date',
                onChange: (event, selectedDate) => {
                    if (selectedDate) {
                        DateTimePickerAndroid.open({
                            value: selectedDate,
                            mode: 'time',
                            is24Hour: true,
                            onChange: (timeEvent, selectedTime) => {
                                if (selectedTime) {
                                    setDueDate(selectedTime);
                                }
                            },
                        });
                    }
                },
            });
        } else {
            setShowDatePicker(true);
        }
    };

    const onIOSDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const dynamicStyles = {
        container: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        },
        header: {
            borderBottomColor: isDark ? '#334155' : '#F3F4F6',
        },
        headerTitle: {
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        closeButton: {
            backgroundColor: isDark ? '#334155' : '#F3F4F6',
        },
        input: {
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
            borderColor: isDark ? '#334155' : '#E5E7EB',
            color: isDark ? '#F8FAFC' : '#1F2937',
        },
        priorityButton: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#E5E7EB',
        },
        dateButton: {
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
            borderColor: isDark ? '#334155' : '#E5E7EB',
        },
        dateText: {
            color: isDark ? '#E2E8F0' : '#374151',
        },
        footer: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderTopColor: isDark ? '#334155' : '#F3F4F6',
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <View style={[styles.container, dynamicStyles.container]}>
                    <View style={[styles.header, dynamicStyles.header]}>
                        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
                            {initialTask ? 'Edit Task' : 'New Task'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, dynamicStyles.closeButton]}>
                            <Ionicons name="close" size={24} color={isDark ? '#94A3B8' : '#6B7280'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.section}>
                            <Text style={styles.label}>TASK NAME</Text>
                            <TextInput
                                style={[styles.input, dynamicStyles.input]}
                                placeholder="What needs to be done?"
                                placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>DESCRIPTION</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, dynamicStyles.input]}
                                placeholder="Add details..."
                                placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>PRIORITY</Text>
                            <View style={styles.priorityRow}>
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <TouchableOpacity
                                        key={p}
                                        style={[
                                            styles.priorityButton,
                                            dynamicStyles.priorityButton,
                                            priority === p && styles.priorityButtonActive,
                                            priority === p && p === 'high' && styles.priorityHigh,
                                            priority === p && p === 'medium' && styles.priorityMedium,
                                            priority === p && p === 'low' && styles.priorityLow,
                                        ]}
                                        onPress={() => setPriority(p)}
                                    >
                                        <Text style={[
                                            styles.priorityText,
                                            priority === p && styles.priorityTextActive,
                                            priority === p && p === 'high' && styles.priorityTextHigh,
                                            priority === p && p === 'medium' && styles.priorityTextMedium,
                                            priority === p && p === 'low' && styles.priorityTextLow,
                                        ]}>
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>DUE DATE & TIME</Text>
                            <TouchableOpacity
                                style={[styles.dateButton, dynamicStyles.dateButton]}
                                onPress={openDatePicker}
                            >
                                <View style={[styles.dateIconContainer, { backgroundColor: isDark ? '#1E1B4B' : '#DBEAFE' }]}>
                                    <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text style={[styles.dateText, dynamicStyles.dateText]}>
                                    {dueDate
                                        ? dueDate.toLocaleString([], {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })
                                        : 'Set reminder'
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, dynamicStyles.footer]}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>
                                {initialTask ? 'Save Changes' : 'Create Task'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showDatePicker && Platform.OS === 'ios' && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="datetime"
                        display="spinner"
                        onChange={onIOSDateChange}
                        minimumDate={new Date()}
                        textColor={isDark ? '#F8FAFC' : '#1F2937'}
                    />
                )}
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    container: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 120,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
    },
    textArea: {
        height: 100,
        paddingTop: 14,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
    },
    priorityButtonActive: {
        borderWidth: 2,
    },
    priorityLow: {
        backgroundColor: '#D1FAE5',
        borderColor: '#059669',
    },
    priorityMedium: {
        backgroundColor: '#DBEAFE',
        borderColor: '#2563EB',
    },
    priorityHigh: {
        backgroundColor: '#FED7AA',
        borderColor: '#EA580C',
    },
    priorityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    priorityTextActive: {
        fontWeight: '700',
    },
    priorityTextLow: {
        color: '#059669',
    },
    priorityTextMedium: {
        color: '#2563EB',
    },
    priorityTextHigh: {
        color: '#EA580C',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dateIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopWidth: 1,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
