export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate?: string; // ISO string
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high';
    notificationId?: string; // To cancel scheduled notification
}
