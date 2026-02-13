
import React, { useState } from 'react';
import { X, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    isRequired?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, isRequired = false }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Preencha usuário e senha');
            setLoading(false);
            return;
        }

        try {
            const result = await login(username, password);
            if (result.success) {
                // Important: Call onClose() here, but the parent should also handle "unforcing" if needed.
                // In our implementation, parent updates state based on currentUser presence.
                onClose();
                setUsername('');
                setPassword('');
            } else {
                setError(result.error || 'Erro ao realizar login');
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
        // Start blocking interactions if required
        >
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                {!isRequired && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                )}

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2">
                        {isRequired ? 'Clube das Abissos' : 'Bem-vindo(a) de volta!'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isRequired
                            ? 'Faça login para acessar o conteúdo exclusivo'
                            : 'Entre para acessar sua conta do Clube'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                placeholder="Seu nome de usuário"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                placeholder="Sua senha"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-brand-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};
