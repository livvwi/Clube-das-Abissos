import React, { createContext, useContext, useState, useEffect } from 'react';

export interface NotificationActor {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
}

export interface NotificationMeta {
    monthKey: string;
    bookId: number;
    bookTitle: string;
    reviewId?: string;
}

export interface NotificationItem {
    id: string;
    type: 'review';
    createdAt: string;
    read: boolean;
    actor: NotificationActor;
    meta: NotificationMeta;
}

interface NotificationsContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const STORAGE_KEY = 'club_notifications_v1';

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    // Initial load
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setNotifications(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse notifications', e);
            }
        }
    }, []);

    // Save to storage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
        const newNotification: NotificationItem = {
            ...notif,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearAll,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
