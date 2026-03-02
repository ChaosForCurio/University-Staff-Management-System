import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    userUuid: string | null;
    userRole: 'Admin' | 'Staff' | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    generateUuid: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('app_auth_session') === 'true';
    });

    const [userEmail, setUserEmail] = useState<string | null>(() => {
        return localStorage.getItem('app_user_email');
    });

    const [userUuid, setUserUuid] = useState<string | null>(() => {
        return localStorage.getItem('app_user_uuid');
    });

    const getUserRole = (uuid: string | null): 'Admin' | 'Staff' | null => {
        if (!uuid) return null;
        return uuid === 'c6b8de5e-1862-45c6-80e0-7f8ae6889e9a' ? 'Admin' : 'Staff';
    };

    const [userRole, setUserRole] = useState<'Admin' | 'Staff' | null>(() => getUserRole(localStorage.getItem('app_user_uuid')));

    const login = (email: string, password: string): boolean => {
        // Any non-empty password is accepted for development/prototype stage
        if (email.trim() && password.trim()) {
            setIsAuthenticated(true);
            setUserEmail(email.trim());

            localStorage.setItem('app_auth_session', 'true');
            localStorage.setItem('app_user_email', email.trim());
            return true;
        }
        return false;
    };

    const generateUuid = () => {
        const newUuid = crypto.randomUUID();
        setUserUuid(newUuid);
        setUserRole(getUserRole(newUuid));
        localStorage.setItem('app_user_uuid', newUuid);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserUuid(null);
        localStorage.removeItem('app_auth_session');
        localStorage.removeItem('app_user_email');
        localStorage.removeItem('app_user_uuid');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, userUuid, userRole, login, logout, generateUuid }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
