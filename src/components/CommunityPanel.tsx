import React from 'react';
import { Send, MoreHorizontal, Smile, Paperclip } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const CommunityPanel: React.FC = () => {
    const { currentUser } = useAuth();

    // Mock messages - in a real app these would come from a backend/context
    // We'll dynamically set 'isMe' based on logged in user
    const rawMessages = [
        { id: 1, user: 'Letícia', avatar: '/icon-let.jpeg', text: 'Alguém já começou o livro do mês?', time: '10:30' },
        { id: 2, user: 'Julianna', avatar: '/icon-juju.png', text: 'Sim! O capítulo 3 explodiu minha mente 🤯', time: '10:32' },
        { id: 3, user: 'Lívia', avatar: '/icon-liv.png', text: 'Sem spoilers! Vou começar hoje à noite.', time: '10:35' },
    ];

    const messages = rawMessages.map(msg => {
        const isMe = currentUser?.name === msg.user;
        return {
            ...msg,
            isMe,
            // If it's me, assume the avatar should be the current user's avatar (or keep the mock one if it matches)
            // For the mock "Lívia" user, if I am logged in as Lívia, I am "Me".
            // If I am logged in as someone else not in the list, I might not see "Me" messages unless I type them.
            // But for this MVP/Demo, let's just mark if name matches.
            user: isMe ? 'Você' : msg.user
        };
    });

    return (
        <aside className="hidden lg:flex w-80 bg-brand-light border-l border-gray-200 flex-col h-screen sticky top-0">

            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <h2 className="font-serif font-bold text-xl text-brand-dark">Comunidade</h2>
                <button className="text-brand-secondary hover:text-brand-primary">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full bg-gray-300 object-cover" />
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.isMe
                            ? 'bg-brand-primary text-white rounded-tr-none'
                            : 'bg-white text-brand-dark shadow-sm border border-gray-100 rounded-tl-none'
                            }`}>
                            <p>{msg.text}</p>
                            <span className={`text-[10px] block mt-1 ${msg.isMe ? 'text-white/70' : 'text-brand-secondary'}`}>
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2 bg-brand-light p-2 rounded-xl">
                    <button className="text-brand-secondary hover:text-brand-primary p-1">
                        <Paperclip size={18} />
                    </button>
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-brand-dark placeholder-brand-secondary/70"
                    />
                    <button className="text-brand-secondary hover:text-brand-primary p-1">
                        <Smile size={18} />
                    </button>
                    <button className="bg-brand-primary text-white p-2 rounded-lg hover:opacity-90 transition-opacity">
                        <Send size={16} />
                    </button>
                </div>
            </div>

        </aside>
    );
};
