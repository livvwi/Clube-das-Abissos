import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import type { NotificationItem } from '../contexts/NotificationsContext';
import { Bell, CheckSquare, Clock } from 'lucide-react';
import { getMonthName } from '../data';

interface NotificationsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose, onNotificationClick }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Determine if click was on the bell button to avoid double toggle
                const target = event.target as HTMLElement;
                if (!target.closest('#bell-button')) {
                    onClose();
                }
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleItemClick = (notif: NotificationItem) => {
        markAsRead(notif.id);
        onNotificationClick(notif);
        onClose();
    };

    const formatRelativeTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'agora';
        if (diffMins < 60) return `${diffMins} min`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h`;

        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div
            ref={dropdownRef}
            className="fixed top-16 right-4 md:absolute md:top-[72px] md:right-24 w-[calc(100vw-32px)] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-fade-in"
        >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-brand-dark flex items-center gap-2">
                    <Bell size={18} className="text-brand-primary" />
                    Notificações
                </h3>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-brand-secondary hover:text-brand-primary font-medium flex items-center gap-1 transition-colors"
                        title="Marcar todas como lidas"
                    >
                        <CheckSquare size={14} />
                        Lidas
                    </button>
                )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Sem notificações no momento</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                            <li
                                key={notif.id}
                                onClick={() => handleItemClick(notif)}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 items-start ${!notif.read ? 'bg-brand-primary/5' : ''}`}
                            >
                                <img
                                    src={notif.actor.avatarUrl}
                                    alt={notif.actor.name}
                                    className="w-10 h-10 rounded-full bg-gray-200 object-cover flex-shrink-0 border border-gray-100 shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${!notif.read ? 'font-bold text-brand-dark' : 'text-gray-700'}`}>
                                        {notif.actor.name} publicou uma resenha
                                    </p>
                                    <p className="text-xs text-brand-primary font-medium truncate mt-0.5">
                                        {notif.meta.bookTitle} — {getMonthName(notif.meta.monthKey)}
                                    </p>
                                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5">
                                        <Clock size={10} /> {formatRelativeTime(notif.createdAt)}
                                    </p>
                                </div>
                                {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
