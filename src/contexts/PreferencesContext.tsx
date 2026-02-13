
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Preferences {
    theme: 'light' | 'dark' | 'system';
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    hideSpoilers: boolean;
    showCurrentMonthOnly: boolean;
    largeCovers: boolean;
    notifications: boolean;
    newReviewAlert: boolean;
}

interface PreferencesContextType {
    preferences: Preferences;
    updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
    toggleTheme: () => void;
}

const DEFAULT_PREFERENCES: Preferences = {
    theme: 'light',
    highContrast: false,
    fontSize: 'medium',
    hideSpoilers: false,
    showCurrentMonthOnly: true,
    largeCovers: false,
    notifications: true,
    newReviewAlert: true,
};

const STORAGE_KEY = 'club_abissos_preferences_v1';

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

    // Initial load
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse preferences", e);
            }
        }
    }, []);

    // Apply side effects (theme, contrast, font)
    useEffect(() => {
        const root = document.documentElement;

        // Theme
        if (preferences.theme === 'dark') {
            root.classList.add('dark');
        } else if (preferences.theme === 'light') {
            root.classList.remove('dark');
        } else {
            // System logic could go here
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }

        // High Contrast
        if (preferences.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Font Size
        root.setAttribute('data-font-size', preferences.fontSize);

        // Persist
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    }, [preferences]);

    const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const toggleTheme = () => {
        setPreferences(prev => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light'
        }));
    };

    return (
        <PreferencesContext.Provider value={{ preferences, updatePreference, toggleTheme }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};
