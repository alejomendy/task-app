import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DateCardProps {
    date: Date;
    isSelected: boolean;
    onPress: () => void;
}

export const DateCard: React.FC<DateCardProps> = ({ date, isSelected, onPress }) => {
    const { isDark } = useTheme();
    const dayAbbr = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = date.getDate();

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-14 h-[72px] rounded-2xl items-center justify-center py-3 ${isSelected ? 'bg-primary shadow-lg shadow-primary elevation-6' : 'bg-surface dark:bg-surface-dark shadow-sm elevation-2'
                }`}
        >
            <Text className={`text-[10px] font-medium mb-[2px] ${isSelected ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'
                }`}>
                {dayAbbr}
            </Text>
            <Text className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-text-dark dark:text-text-dark-d'
                }`}>
                {dayNum}
            </Text>
            {isSelected && <View className="w-[3px] h-[3px] rounded-full bg-white mt-1" />}
        </TouchableOpacity>
    );
};
