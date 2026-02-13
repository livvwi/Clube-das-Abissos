
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfaces
export interface User {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    role: 'admin' | 'member' | 'guest'; // basic roles
}

interface AuthContextType {
    currentUser: User | null;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

// Hardcoded users (seed)
const USERS_SEED: Record<string, User & { passwordHash: string }> = { // storing "hash" for simplicity (actually store plain text or basic hash in MVP)
    'leticia': {
        id: 'user_let',
        username: 'leticia',
        name: 'Letícia',
        avatarUrl: '/icon-let.jpeg',
        role: 'member',
        passwordHash: 'Clube@123'
    },
    'julianna': {
        id: 'user_ju',
        username: 'julianna',
        name: 'Julianna',
        avatarUrl: '/icon-juju.png',
        role: 'member',
        passwordHash: 'Clube@123'
    },
    'livia': {
        id: 'user_liv',
        username: 'livia',
        name: 'Lívia',
        avatarUrl: '/icon-liv.png',
        role: 'member',
        passwordHash: 'Clube@123'
    }
};

const STORAGE_KEY = 'club_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const session = JSON.parse(stored);
                // Validate if user still exists/valid (optional)
                setCurrentUser(session);
            } catch (e) {
                console.error("Failed to parse auth session", e);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
        // Find user by username (case insensitive)
        const userKey = Object.keys(USERS_SEED).find(k => k.toLowerCase() === usernameInput.toLowerCase());

        if (!userKey) {
            return { success: false, error: 'Usuário não encontrado.' };
        }

        const user = USERS_SEED[userKey];

        // Check password (plain text check for MVP)
        if (user.passwordHash !== passwordInput) {
            return { success: false, error: 'Senha incorreta.' };
        }

        // Success
        const { passwordHash, ...safeUser } = user; // remove password from state
        setCurrentUser(safeUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_KEY);
        // Optionally redirect or show modal
    };

    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
