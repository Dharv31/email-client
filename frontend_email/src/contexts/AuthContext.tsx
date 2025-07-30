import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken } from '../api/getToken';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const response = await getToken();
            if (response && response.token) {
                setToken(response.token);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setToken(null);
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            setIsAuthenticated(false);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        // Redirect to backend auth endpoint
        window.location.href = 'http://localhost:4000/auth/login';
    };

    const logout = async () => {
        try {
            // Clear authentication state
            setIsAuthenticated(false);
            setToken(null);
            
            // Clear any stored tokens (cookies will be cleared by server)
            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
