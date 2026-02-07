import React from 'react';
import { Home, BookOpen, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'home', icon: Home, label: 'Início' },
        { id: 'library', icon: BookOpen, label: 'Resenhas' },
    ];

    return (
        <aside className="w-24 bg-brand-light flex flex-col items-center py-8 border-r border-gray-200 h-screen sticky top-0">
            <div className="mb-12">
                {/* Logo Placeholder - using a simple icon if image not found */}
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                    CA
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center group relative
                ${isActive
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'text-brand-secondary hover:bg-white hover:shadow-sm'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                            {/* Tooltip */}
                            <span className="absolute left-14 bg-brand-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-6 w-full px-4">
                <button className="p-3 rounded-2xl text-brand-secondary hover:bg-white hover:shadow-sm transition-all flex items-center justify-center">
                    <Settings size={24} />
                </button>
                <button className="p-3 rounded-2xl text-brand-secondary hover:bg-red-50 hover:text-red-400 transition-all flex items-center justify-center">
                    <LogOut size={24} />
                </button>
            </div>
        </aside>
    );
};
