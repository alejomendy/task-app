import { useTasksContext } from '../contexts/TasksContext';

export const useTasks = () => {
    return useTasksContext();
};
