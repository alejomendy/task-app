import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeMode>('system');
    const systemColorScheme = useNativeColorScheme();

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                setThemeState(savedTheme as ThemeMode);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (mode: ThemeMode) => {
        setThemeState(mode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    };

    const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
