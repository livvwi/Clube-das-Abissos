import React from 'react';
import { Send, MoreHorizontal, Smile, Paperclip } from 'lucide-react';

export const CommunityPanel: React.FC = () => {
    const messages = [
        { id: 1, user: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=1', text: 'Alguém já começou o livro do mês?', time: '10:30', isMe: false },
        { id: 2, user: 'Carlos M.', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Sim! O capítulo 3 explodiu minha mente 🤯', time: '10:32', isMe: false },
        { id: 3, user: 'Você', avatar: 'https://i.pravatar.cc/150?u=3', text: 'Sem spoilers! Vou começar hoje à noite.', time: '10:35', isMe: true },
    ];

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
