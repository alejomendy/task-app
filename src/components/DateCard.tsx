import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

    const cardStyles = {
        backgroundColor: isSelected
            ? '#3B82F6'
            : (isDark ? '#1E293B' : '#FFFFFF'),
    };

    const textStyles = {
        day: {
            color: isSelected
                ? 'rgba(255,255,255,0.7)'
                : (isDark ? '#94A3B8' : '#9CA3AF')
        },
        num: {
            color: isSelected
                ? '#FFFFFF'
                : (isDark ? '#F8FAFC' : '#374151')
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                cardStyles,
                isSelected ? styles.shadowActive : styles.shadowInactive
            ]}
        >
            <Text style={[styles.dayText, textStyles.day]}>
                {dayAbbr}
            </Text>
            <Text style={[styles.numText, textStyles.num]}>
                {dayNum}
            </Text>
            {isSelected && <View style={styles.dot} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 56,
        height: 72,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    shadowInactive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    shadowActive: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    dayText: {
        fontSize: 10,
        fontWeight: '500',
        marginBottom: 2,
    },
    numText: {
        fontSize: 20,
        fontWeight: '700',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#FFFFFF',
        marginTop: 4,
    },
});
