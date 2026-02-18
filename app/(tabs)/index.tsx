import { DateStrip } from '@/src/components/DateStrip';
import { TaskForm } from '@/src/components/TaskForm';
import { TaskItem } from '@/src/components/TaskItem';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useTasks } from '@/src/hooks/useTasks';
import { Task } from '@/src/types/task';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#0F172A' : '#F5F5F5' }]}>
        <Text style={[styles.loadingText, { color: isDark ? '#94A3B8' : '#6B7280' }]}>Loading...</Text>
      </View>
    );
  }

  const dynamicStyles = {
    safeArea: {
      backgroundColor: isDark ? '#0F172A' : '#F5F5F5',
    },
    headerTitle: {
      color: isDark ? '#F8FAFC' : '#1F2937',
    },
    headerSubtitle: {
      color: isDark ? '#64748B' : '#9CA3AF',
    },
    searchButton: {
      backgroundColor: isDark ? '#1E293B' : '#F3F4F6',
    },
    mainCard: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    },
    dayHeader: {
      borderBottomColor: isDark ? '#334155' : '#F3F4F6',
    },
    dayHeaderLeft: {
      color: isDark ? '#64748B' : '#9CA3AF',
    },
    sectionHeader: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    },
    sectionHeaderText: {
      color: isDark ? '#F8FAFC' : '#374151',
    },
    emptyText: {
      color: isDark ? '#64748B' : '#9CA3AF',
    },
    emptySubtext: {
      color: isDark ? '#475569' : '#D1D5DB',
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, dynamicStyles.safeArea]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#0F172A" : "#F5F5F5"} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <Text style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
            Week {getWeekNumber(selectedDate)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.searchButton, dynamicStyles.searchButton]}
          onPress={() => {
            // TODO: Implement search functionality
          }}
        >
          <Ionicons name="search-outline" size={18} color={isDark ? '#94A3B8' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Date Strip */}
      <View style={styles.dateStripContainer}>
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {/* Main Content Card */}
      <View style={[styles.mainCard, dynamicStyles.mainCard]}>
        {/* Day Header */}
        <View style={[styles.dayHeader, dynamicStyles.dayHeader]}>
          <Text style={[styles.dayHeaderLeft, dynamicStyles.dayHeaderLeft]}>
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            }).toUpperCase()}
          </Text>
          <Text style={styles.dayHeaderRight}>
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
            <View style={[styles.sectionHeader, dynamicStyles.sectionHeader]}>
              <Ionicons name={icon} size={16} color={isDark ? '#3B82F6' : '#374151'} />
              <Text style={[styles.sectionHeaderText, dynamicStyles.sectionHeaderText]}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? '#1F2937' : '#E5E7EB'} />
              <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No tasks for this day</Text>
              <Text style={[styles.emptySubtext, dynamicStyles.emptySubtext]}>Tap + to add a new task</Text>
            </View>
          }
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateStripContainer: {
    marginBottom: 16,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dayHeaderLeft: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dayHeaderRight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B82F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
