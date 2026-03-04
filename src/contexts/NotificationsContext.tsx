import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotifications, markAllNotificationsRead } from '../services/db';
import { supabase } from '../lib/supabaseClient';
import { booksByMonth } from '../data';

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

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const loadFromDb = async () => {
        const { data, error } = await fetchNotifications();
        if (error) {
            console.error('RLS bloqueou SELECT. Ajuste policies no Supabase para tabela notifications.', error);
            return;
        }
        if (data) {
            const getBookDetailsFromTitle = (title: string) => {
                for (const [monthKey, books] of Object.entries(booksByMonth)) {
                    const book = books.find(b => b.title === title) as any;
                    if (book) return { monthKey, bookId: book.id };
                }
                return { monthKey: '2026-01', bookId: 0 };
            };

            const formatted: NotificationItem[] = data.map((d: any) => {
                const { monthKey, bookId } = getBookDetailsFromTitle(d.book_title);
                return {
                    id: d.id,
                    type: 'review',
                    createdAt: d.created_at,
                    read: d.read,
                    actor: {
                        id: d.actor_id,
                        name: d.actor_name,
                        username: d.actor_name, // fallback for username
                        avatarUrl: d.actor_avatar,
                    },
                    meta: {
                        monthKey,
                        bookId,
                        bookTitle: d.book_title,
                    }
                };
            });
            setNotifications(formatted);
        }
    };

    // Initial load & realtime
    useEffect(() => {
        loadFromDb();

        const channel = supabase.channel('realtime_notifications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
                loadFromDb();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
        // Optimistic add (API already handles real insertion for reviews)
        const newNotification: NotificationItem = {
            ...notif,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
        await supabase.from('notifications').update({ read: true }).eq('id', id);
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await markAllNotificationsRead();
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
