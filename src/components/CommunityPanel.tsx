import React, { useState, useEffect, useRef } from 'react';
import { Send, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
    id: string;
    text: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        username: string;
        avatarUrl: string;
    };
}

interface CommunityPanelProps {
    isMobileMode?: boolean;
    onCloseMobile?: () => void;
}

const STORAGE_KEY = 'club_chat_messages_v2';

export const CommunityPanel: React.FC<CommunityPanelProps> = ({ isMobileMode, onCloseMobile }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    // Initial load
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setMessages(JSON.parse(stored));
            } catch (error) {
                console.error("Failed to parse chat messages", error);
            }
        }
    }, []);

    // Save to storage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // Handle scroll events to detect if user is at the bottom
    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // 50px threshold
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
        setIsScrolledToBottom(isBottom);
    };

    // Auto scroll to bottom when messages change and we are at the bottom
    useEffect(() => {
        if (isScrolledToBottom && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
         
    }, [messages, isScrolledToBottom]);



    const handleSend = () => {
        if (!inputText.trim() || !currentUser) return;

        const newMsg: ChatMessage = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            text: inputText.trim(),
            createdAt: new Date().toISOString(),
            user: {
                id: currentUser.id,
                name: currentUser.name,
                username: currentUser.username,
                avatarUrl: currentUser.avatarUrl
            }
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        // Force scroll to bottom when user sends a message
        setIsScrolledToBottom(true);
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateDivider = (isoDate: string) => {
        const date = new Date(isoDate);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    };

    return (
        <aside className={`${isMobileMode ? 'flex w-full h-full pb-16' : 'hidden md:flex w-80 h-screen sticky top-0'} bg-brand-light border-l border-gray-200 flex-col relative`}>

            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center gap-3">
                    {isMobileMode && onCloseMobile && (
                        <button onClick={onCloseMobile} className="p-2 -ml-2 rounded-full hover:bg-black/5 text-brand-dark" aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                    )}
                    <h2 className="font-serif font-bold text-lg md:text-xl text-brand-dark">Comunidade</h2>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-24 md:pb-24"
            >
                {messages.length === 0 && (
                    <div className="text-center text-brand-secondary py-10 opacity-70">
                        <p className="text-sm font-medium mb-1">Amigos abissais...</p>
                        <p className="text-xs">O chat está silencioso. Seja o primeiro a dar um oi!</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = currentUser?.id === msg.user?.id;
                    const showDateDivider = index === 0 || new Date(messages[index - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                    return (
                        <React.Fragment key={msg.id}>
                            {showDateDivider && (
                                <div className="flex justify-center my-4">
                                    <span className="text-[10px] font-medium bg-gray-100/80 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {formatDateDivider(msg.createdAt)}
                                    </span>
                                </div>
                            )}
                            <div className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : ''}`}>
                                <img src={msg.user?.avatarUrl} alt={msg.user?.name} className="w-8 h-8 rounded-full bg-gray-300 object-cover flex-shrink-0 border border-gray-200 shadow-sm" />
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {!isMe && <span className="text-[11px] text-brand-secondary font-medium mb-1 mx-1">{msg.user?.name}</span>}
                                    {isMe && <span className="text-[11px] text-brand-secondary font-medium mb-1 mx-1">Você</span>}

                                    <div className={`max-w-[210px] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${isMe
                                        ? 'bg-brand-primary text-white rounded-br-sm'
                                        : 'bg-white text-brand-dark border border-gray-100 rounded-bl-sm'
                                        }`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block mt-1.5 ${isMe ? 'text-white/70 text-right' : 'text-brand-secondary text-right'}`}>
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-transparent z-10 ${isMobileMode ? 'pb-safe-bottom' : ''}`}>
                <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                    {!currentUser ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 text-brand-secondary h-[72px]">
                            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                                <LogIn size={14} /> Faça login para conversar
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-end gap-2 p-2 bg-white">
                            <textarea
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-gray-50 p-2.5 rounded-xl border-none outline-none text-sm text-brand-dark placeholder-brand-secondary/70 resize-none max-h-32 custom-scrollbar transition-all focus:bg-white focus:ring-1 focus:ring-brand-primary/20"
                                rows={1}
                                style={{ minHeight: '40px' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                                className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:bg-gray-300 flex-shrink-0 active:scale-95"
                            >
                                <Send size={16} className={inputText.trim() ? "translate-x-0.5" : ""} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </aside>
    );
};
