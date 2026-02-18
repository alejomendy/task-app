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

import { supabaseTasks } from '../services/supabaseTasks';
import { useAuth } from './AuthContext';

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) {
                const localTasks = await loadTasks();
                setTasks(localTasks);
                setLoading(false);
                return;
            }

            try {
                const cloudTasks = await supabaseTasks.fetchTasks();
                setTasks(cloudTasks);
            } catch (e) {
                console.error('Failed to fetch from cloud, falling back to local', e);
                const localTasks = await loadTasks();
                setTasks(localTasks);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

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

        const newTaskPayload: Omit<Task, 'id'> = {
            title,
            description,
            priority,
            dueDate: dueDate?.toISOString(),
            isCompleted: false,
            notificationId,
            ...(user ? { user_id: user.id } : {}),
        };

        if (user) {
            try {
                const cloudTask = await supabaseTasks.createTask(newTaskPayload);
                setTasks(prev => [...prev, cloudTask]);
            } catch (e) {
                Alert.alert('Error', 'Failed to save task to cloud');
            }
        } else {
            const newTask: Task = {
                id: Date.now().toString(),
                ...newTaskPayload,
            };
            setTasks(prev => [...prev, newTask]);
        }
    }, [user]);

    const updateTask = useCallback(async (updatedTask: Task) => {
        if (user) {
            try {
                const { id, ...updates } = updatedTask;
                await supabaseTasks.updateTask(id, updates);
            } catch (e) {
                console.warn('Failed to sync update to cloud');
            }
        }
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }, [user]);

    const deleteTask = useCallback(async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task?.notificationId) {
            await cancelTaskNotification(task.notificationId);
        }

        if (user) {
            try {
                await supabaseTasks.deleteTask(id);
            } catch (e) {
                console.warn('Failed to delete from cloud');
            }
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    }, [tasks, user]);

    const toggleComplete = useCallback(async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = !task.isCompleted;
        if (newStatus && task.notificationId) {
            cancelTaskNotification(task.notificationId);
        }

        const updatedTask = { ...task, isCompleted: newStatus };

        if (user) {
            try {
                await supabaseTasks.updateTask(id, { isCompleted: newStatus });
            } catch (e) {
                console.warn('Failed to sync completion to cloud');
            }
        }

        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    }, [tasks, user]);

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
