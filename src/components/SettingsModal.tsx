
import React from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { X, Moon, Sun, Layers, Type, Eye, Bell } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { preferences, updatePreference, toggleTheme } = usePreferences();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark">Configurações</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">

                    {/* Appearance Section */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary mb-4">
                            <Layers size={20} /> Aparência
                        </h3>
                        <div className="space-y-4 pl-7">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">Tema</p>
                                    <p className="text-sm text-gray-500">Alternar entre claro e escuro</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${preferences.theme === 'dark' ? 'bg-brand-primary' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform flex items-center justify-center ${preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                                        {preferences.theme === 'dark' ? <Moon size={14} className="text-brand-primary" /> : <Sun size={14} className="text-yellow-500" />}
                                    </span>
                                </button>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">Alto Contraste</p>
                                    <p className="text-sm text-gray-500">Aumentar legibilidade</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.highContrast}
                                        onChange={(e) => updatePreference('highContrast', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                </label>
                            </div>

                            <div>
                                <p className="font-medium text-gray-800 mb-2 flex items-center gap-2"><Type size={16} /> Tamanho da Fonte</p>
                                <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                                    {(['small', 'medium', 'large'] as const).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => updatePreference('fontSize', size)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${preferences.fontSize === size
                                                ? 'bg-white text-brand-primary shadow-sm'
                                                : 'text-gray-500 hover:text-brand-dark'
                                                }`}
                                        >
                                            {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Reading Preferences */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary mb-4">
                            <Eye size={20} /> Preferências de Leitura
                        </h3>
                        <div className="space-y-3 pl-7">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Ocultar resenhas com spoiler</span>
                                <input
                                    type="checkbox"
                                    checked={preferences.hideSpoilers}
                                    onChange={(e) => updatePreference('hideSpoilers', e.target.checked)}
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Mostrar apenas livros do mês atual</span>
                                <input
                                    type="checkbox"
                                    checked={preferences.showCurrentMonthOnly}
                                    onChange={(e) => updatePreference('showCurrentMonthOnly', e.target.checked)}
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Notifications */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary mb-4">
                            <Bell size={20} /> Notificações
                        </h3>
                        <div className="space-y-3 pl-7">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Receber notificações do clube</span>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications}
                                    onChange={(e) => updatePreference('notifications', e.target.checked)}
                                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
