import { supabase } from '../lib/supabase';
import { Task } from '../types/task';

const mapToDb = (task: Partial<Task>) => ({
    title: task.title,
    description: task.description,
    priority: task.priority,
    due_date: task.dueDate,
    is_completed: task.isCompleted,
    notification_id: task.notificationId,
    user_id: (task as any).user_id,
});

const mapFromDb = (dbTask: any): Task => ({
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    priority: dbTask.priority,
    dueDate: dbTask.due_date,
    isCompleted: dbTask.is_completed,
    notificationId: dbTask.notification_id,
});

export const supabaseTasks = {
    async fetchTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
        return data.map(mapFromDb);
    },

    async createTask(task: Omit<Task, 'id'>) {
        const dbTask = mapToDb(task as Partial<Task>);
        const { data, error } = await supabase
            .from('tasks')
            .insert([dbTask])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw error;
        }
        return mapFromDb(data);
    },

    async updateTask(id: string, updates: Partial<Task>) {
        const dbUpdates = mapToDb(updates);
        const { data, error } = await supabase
            .from('tasks')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw error;
        }
        return mapFromDb(data);
    },

    async deleteTask(id: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};
