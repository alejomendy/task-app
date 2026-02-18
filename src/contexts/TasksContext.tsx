import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { cancelTaskNotification, scheduleTaskNotification } from '../services/notifications';
import { loadTasks, saveTasks } from '../services/storage';
import { Task } from '../types/task';

interface TasksContextType {
    tasks: Task[];
    loading: boolean;
    addTask: (title: string, description: string, priority: Task['priority'], dueDate?: Date) => Promise<void>;
    updateTask: (updatedTask: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleComplete: (id: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const loadedTasks = await loadTasks();
            setTasks(loadedTasks);
            setLoading(false);
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        if (!loading) {
            saveTasks(tasks);
        }
    }, [tasks, loading]);

    const addTask = useCallback(async (title: string, description: string, priority: Task['priority'], dueDate?: Date) => {
        let notificationId: string | undefined;

        if (dueDate) {
            const id = await scheduleTaskNotification(title, `Reminder: ${title}`, dueDate);
            if (id) {
                notificationId = id;
            } else {
                Alert.alert('Warning', 'Could not schedule notification. Check permissions.');
            }
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            dueDate: dueDate?.toISOString(),
            isCompleted: false,
            notificationId,
        };

        setTasks(prev => [...prev, newTask]);
    }, []);

    const updateTask = useCallback(async (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task?.notificationId) {
            await cancelTaskNotification(task.notificationId);
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    }, [tasks]);

    const toggleComplete = useCallback((id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const newStatus = !t.isCompleted;
                if (newStatus && t.notificationId) {
                    cancelTaskNotification(t.notificationId);
                }
                return { ...t, isCompleted: newStatus };
            }
            return t;
        }));
    }, []);

    return (
        <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleComplete }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasksContext = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasksContext must be used within a TasksProvider');
    }
    return context;
};
