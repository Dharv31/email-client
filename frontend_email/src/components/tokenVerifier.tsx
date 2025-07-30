// src/components/TokenVerifier.tsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * @deprecated This component is replaced by AuthContext and ProtectedRoute
 * Use AuthProvider and ProtectedRoute instead
 */
const TokenVerifier = () => {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return null;
};

export default TokenVerifier;
