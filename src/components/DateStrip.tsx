import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { DateCard } from './DateCard';

interface DateStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const DateStrip: React.FC<DateStripProps> = ({ selectedDate, onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Update current date every minute to keep it fresh
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Generate current week (7 days starting from today)
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentDate);
        d.setDate(currentDate.getDate() + i);
        return d;
    });

    const isDateSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    return (
        <View className="mb-5">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
                {dates.map((date, index) => (
                    <DateCard
                        key={`${date.toISOString()}-${index}`}
                        date={date}
                        isSelected={isDateSelected(date)}
                        onPress={() => onSelectDate(date)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};
