import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { SectionList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateStrip } from '../../src/components/DateStrip';
import { TaskForm } from '../../src/components/TaskForm';
import { TaskItem } from '../../src/components/TaskItem';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import { Task } from '../../src/types/task';

export default function HomeScreen() {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { isDark } = useTheme();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const filteredTasks = useMemo(() => {
    // Show all incomplete tasks, regardless of date
    return tasks.filter(task => !task.isCompleted);
  }, [tasks]);

  const sections = useMemo(() => {
    const morning = filteredTasks.filter(t => {
      const h = t.dueDate ? new Date(t.dueDate).getHours() : 9;
      return h < 12;
    });
    const afternoon = filteredTasks.filter(t => {
      const h = t.dueDate ? new Date(t.dueDate).getHours() : 14;
      return h >= 12 && h < 18;
    });
    const evening = filteredTasks.filter(t => {
      const h = t.dueDate ? new Date(t.dueDate).getHours() : 20;
      return h >= 18;
    });

    const result = [];
    if (morning.length > 0) {
      result.push({ title: 'Morning', data: morning, icon: 'sunny-outline' as const });
    }
    if (afternoon.length > 0) {
      result.push({ title: 'Afternoon', data: afternoon, icon: 'partly-sunny-outline' as const });
    }
    if (evening.length > 0) {
      result.push({ title: 'Evening', data: evening, icon: 'moon-outline' as const });
    }

    return result;
  }, [filteredTasks]);

  const tasksLeft = filteredTasks.length;

  const getWeekNumber = (d: Date) => {
    const onejan = new Date(d.getFullYear(), 0, 1);
    const millisecs = d.getTime() - onejan.getTime();
    return Math.ceil((((millisecs / 86400000) + onejan.getDay() + 1) / 7));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
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
    } else {
      await addTask(title, description, priority, dueDate);
    }
    setIsFormVisible(false);
    setEditingTask(undefined);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark">
        <Text className="text-sm text-text-light dark:text-text-light-d">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0F172A" : "#F5F5F5"} />

      {/* Header */}
      <View className="flex-row justify-between items-start px-5 pt-4 pb-3">
        <View>
          <Text className="text-[26px] font-bold leading-8 text-text-dark dark:text-text-dark-d">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <Text className="text-[13px] font-normal mt-[2px] text-text-light dark:text-text-light-d">
            Week {getWeekNumber(selectedDate)}
          </Text>
        </View>
        <TouchableOpacity
          className="w-[38px] h-[38px] rounded-full items-center justify-center bg-bg-light dark:bg-bg-light-dark"
          onPress={() => {
            // TODO: Implement search functionality
          }}
        >
          <Ionicons name="search-outline" size={18} color={isDark ? '#94A3B8' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Date Strip */}
      <View className="mb-4">
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {/* Main Content Card */}
      <View className="flex-1 rounded-t-[32px] bg-surface dark:bg-surface-dark shadow-md elevation-8">
        {/* Day Header */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-border dark:border-border-dark">
          <Text className="text-[11px] font-bold tracking-widest text-text-light dark:text-text-light-d">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            }).toUpperCase()}
          </Text>
          <Text className="text-[13px] font-bold text-primary">
            {tasksLeft} Tasks Left
          </Text>
        </View>

        {/* Task List */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleComplete}
              onDelete={deleteTask}
              onEdit={handleEditTask}
            />
          )}
          renderSectionHeader={({ section: { title, icon } }) => (
            <View className="flex-row items-center px-5 pt-5 pb-2 bg-surface dark:bg-surface-dark">
              <Ionicons name={icon} size={16} color={isDark ? '#3B82F6' : '#374151'} />
              <Text className="text-[15px] font-bold ml-2 text-text-dark dark:text-text-dark-d">{title}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? '#1F2937' : '#E5E7EB'} />
              <Text className="mt-3 text-[15px] font-medium text-text-light dark:text-text-light-d">No tasks for this day</Text>
              <Text className="text-[13px] mt-1 text-slate-400 dark:text-slate-600">Tap + to add a new task</Text>
            </View>
          }
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        className="absolute w-14 h-14 rounded-full bg-primary bottom-6 right-6 items-center justify-center shadow-lg shadow-primary elevation-8"
        onPress={handleAddTask}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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


