import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-end bg-black/60"
            >
                <View className="bg-surface dark:bg-surface-dark rounded-t-[32px] h-[90%] shadow-xl elevation-10">
                    <View className="flex-row justify-between items-center px-6 pt-6 pb-4 border-b border-border dark:border-border-dark">
                        <Text className="text-2xl font-bold text-text-dark dark:text-text-dark-d">
                            {initialTask ? 'Edit Task' : 'New Task'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 rounded-full items-center justify-center bg-bg-light dark:bg-bg-light-dark"
                        >
                            <Ionicons name="close" size={24} color={isDark ? '#94A3B8' : '#6B7280'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
                    >
                        <View className="mb-6">
                            <Text className="text-[11px] font-bold text-slate-500 tracking-wider mb-2">TASK NAME</Text>
                            <TextInput
                                className="border border-border dark:border-border-dark rounded-2xl px-4 py-[14px] text-[15px] bg-bg-light dark:bg-background-dark text-text-dark dark:text-text-dark-d"
                                placeholder="What needs to be done?"
                                placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-[11px] font-bold text-slate-500 tracking-wider mb-2">DESCRIPTION</Text>
                            <TextInput
                                className="border border-border dark:border-border-dark rounded-2xl px-4 py-[14px] text-[15px] bg-bg-light dark:bg-background-dark text-text-dark dark:text-text-dark-d min-h-[100px]"
                                placeholder="Add details..."
                                placeholderTextColor={isDark ? '#475569' : '#9CA3AF'}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-[11px] font-bold text-slate-500 tracking-wider mb-2">PRIORITY</Text>
                            <View className="flex-row gap-3">
                                {(['low', 'medium', 'high'] as const).map((p) => {
                                    const active = priority === p;
                                    let borderColor = 'border-border dark:border-border-dark';
                                    let bgColor = 'bg-surface dark:bg-surface-dark';
                                    let textColor = 'text-slate-500';

                                    if (active) {
                                        if (p === 'high') { borderColor = 'border-orange-500'; bgColor = 'bg-orange-50 dark:bg-orange-950/30'; textColor = 'text-orange-600'; }
                                        if (p === 'medium') { borderColor = 'border-primary'; bgColor = 'bg-blue-50 dark:bg-blue-950/30'; textColor = 'text-primary'; }
                                        if (p === 'low') { borderColor = 'border-emerald-600'; bgColor = 'bg-emerald-50 dark:bg-emerald-950/30'; textColor = 'text-emerald-700'; }
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={p}
                                            className={`flex-1 py-3 rounded-xl border-2 items-center ${borderColor} ${bgColor}`}
                                            onPress={() => setPriority(p)}
                                        >
                                            <Text className={`text-sm ${active ? 'font-bold' : 'font-semibold'} ${textColor}`}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[11px] font-bold text-slate-500 tracking-wider mb-2">DUE DATE & TIME</Text>
                            <TouchableOpacity
                                className="flex-row items-center border border-border dark:border-border-dark rounded-2xl px-4 py-[14px] bg-bg-light dark:bg-background-dark"
                                onPress={openDatePicker}
                            >
                                <View className="w-9 h-9 rounded-xl items-center justify-center mr-3 bg-blue-100 dark:bg-indigo-950">
                                    <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                                </View>
                                <Text className="text-sm font-medium text-text-dark dark:text-text-dark-d">
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

                    <View className="absolute bottom-0 left-0 right-0 p-6 bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark">
                        <TouchableOpacity
                            className="bg-primary rounded-2xl py-4 items-center shadow-lg shadow-primary elevation-4"
                            onPress={handleSubmit}
                        >
                            <Text className="text-base font-bold text-white">
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
