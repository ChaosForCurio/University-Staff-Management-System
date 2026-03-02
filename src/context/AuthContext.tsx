import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserRecord {
    email: string;
    uuid: string | null;
    role: 'Admin' | 'Normal';
    displayName: string;
    createdAt: string;
    lastLogin: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    userUuid: string | null;
    userRole: 'Admin' | 'Normal' | null;
    userData: UserRecord | null;
    login: (email: string, password: string) => Promise<boolean>;
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

    const getUserRole = (uuid: string | null): 'Admin' | 'Normal' | null => {
        if (!uuid) return null;
        return uuid === '062a7766-dde6-4665-b0dc-d5e75ec8e9c8' ? 'Admin' : 'Normal';
    };

    const [userRole, setUserRole] = useState<'Admin' | 'Normal' | null>(() => getUserRole(localStorage.getItem('app_user_uuid')));

    const [userData, setUserData] = useState<UserRecord | null>(() => {
        const email = localStorage.getItem('app_user_email');
        if (!email) return null;
        const usersDb = JSON.parse(localStorage.getItem('app_users_db') || '{}');
        return usersDb[email] || null;
    });

    const hashPassword = async (password: string): Promise<string> => {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Global Migration Effect: Consolidate all existing user data into the unified DB
    useEffect(() => {
        const migrateData = () => {
            const usersDb = JSON.parse(localStorage.getItem('app_users_db') || '{}');
            const oldCreds = JSON.parse(localStorage.getItem('app_user_credentials') || '{}');
            const oldUuids = JSON.parse(localStorage.getItem('app_user_uuids') || '{}');

            let hasChanges = false;

            // Migrate all credentials
            Object.keys(oldCreds).forEach(email => {
                if (!usersDb[email]) {
                    usersDb[email] = {
                        email: email,
                        passwordHash: oldCreds[email],
                        uuid: oldUuids[email] || null
                    };
                    hasChanges = true;
                }
            });

            // Ensure all UUIDs are migrated even if no credentials existed (unlikely but safe)
            Object.keys(oldUuids).forEach(email => {
                if (usersDb[email] && usersDb[email].uuid !== oldUuids[email]) {
                    usersDb[email].uuid = oldUuids[email];
                    hasChanges = true;
                } else if (!usersDb[email]) {
                    // If we have a UUID but no password (shouldn't happen with current logic, but for robustness)
                    usersDb[email] = {
                        email: email,
                        passwordHash: '', // Placeholder, user will need to set password on next login attempt if ever possible
                        uuid: oldUuids[email]
                    };
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                localStorage.setItem('app_users_db', JSON.stringify(usersDb));
            }
        };

        migrateData();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) return false;

        const hashedPassword = await hashPassword(trimmedPassword);

        // Unified User Database Implementation
        const usersDb = JSON.parse(localStorage.getItem('app_users_db') || '{}');
        const now = new Date().toISOString();

        // Migration logic for old fragmented data
        if (!usersDb[trimmedEmail]) {
            const oldCreds = JSON.parse(localStorage.getItem('app_user_credentials') || '{}');
            const oldUuids = JSON.parse(localStorage.getItem('app_user_uuids') || '{}');

            if (oldCreds[trimmedEmail]) {
                const uuid = oldUuids[trimmedEmail] || null;
                usersDb[trimmedEmail] = {
                    email: trimmedEmail,
                    passwordHash: oldCreds[trimmedEmail],
                    uuid: uuid,
                    role: getUserRole(uuid),
                    displayName: trimmedEmail.split('@')[0],
                    createdAt: now,
                    lastLogin: now
                };
            }
        }

        const userRecord = usersDb[trimmedEmail];

        if (userRecord) {
            // Verify password
            if (userRecord.passwordHash !== hashedPassword) {
                // Compatibility check: if stored password is plain text
                if (userRecord.passwordHash === trimmedPassword) {
                    userRecord.passwordHash = hashedPassword;
                    userRecord.lastLogin = now;
                    usersDb[trimmedEmail] = userRecord;
                    localStorage.setItem('app_users_db', JSON.stringify(usersDb));
                } else {
                    return false;
                }
            } else {
                userRecord.lastLogin = now;
                usersDb[trimmedEmail] = userRecord;
                localStorage.setItem('app_users_db', JSON.stringify(usersDb));
            }
        } else {
            // New user registration in the unified DB
            usersDb[trimmedEmail] = {
                email: trimmedEmail,
                passwordHash: hashedPassword,
                uuid: null,
                role: 'Normal',
                displayName: trimmedEmail.split('@')[0],
                createdAt: now,
                lastLogin: now
            };
            localStorage.setItem('app_users_db', JSON.stringify(usersDb));
        }

        const currentUser = usersDb[trimmedEmail];

        setIsAuthenticated(true);
        setUserEmail(trimmedEmail);
        setUserUuid(currentUser.uuid);
        setUserRole(currentUser.role);
        setUserData(currentUser);

        localStorage.setItem('app_auth_session', 'true');
        localStorage.setItem('app_user_email', trimmedEmail);
        if (currentUser.uuid) {
            localStorage.setItem('app_user_uuid', currentUser.uuid);
        }
        return true;
    };

    const generateUuid = () => {
        if (userUuid || !userEmail) return;

        const newUuid = crypto.randomUUID();
        const newRole = getUserRole(newUuid);

        setUserUuid(newUuid);
        setUserRole(newRole);

        localStorage.setItem('app_user_uuid', newUuid);

        // Update unified database
        const usersDb = JSON.parse(localStorage.getItem('app_users_db') || '{}');
        if (usersDb[userEmail]) {
            usersDb[userEmail].uuid = newUuid;
            usersDb[userEmail].role = newRole;
            localStorage.setItem('app_users_db', JSON.stringify(usersDb));
            setUserData({ ...usersDb[userEmail] });
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserUuid(null);
        setUserRole(null);
        setUserData(null);
        localStorage.removeItem('app_auth_session');
        localStorage.removeItem('app_user_email');
        localStorage.removeItem('app_user_uuid');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, userUuid, userRole, userData, login, logout, generateUuid }}>
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
