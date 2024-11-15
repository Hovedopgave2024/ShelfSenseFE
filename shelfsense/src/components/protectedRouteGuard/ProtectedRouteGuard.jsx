// src/components/ProtectedRouteGuard.js
/*

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useSessionStore from '../../stores/useSessionStore';
import fetchSession from '../../services/fetchSession';

const ProtectedRouteGuard = ({ children }) => {
    const user = useSessionStore((state) => state.user);
    const setUser = useSessionStore((state) => state.setUser);
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // null for loading state

    useEffect(() => {
        const verifySession = async () => {
            const sessionDTO = await fetchSession();

            if (sessionDTO) {
                setUser(sessionDTO);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        if (!user) {
            verifySession(); // Only verify session if user isn't already set
        } else {
            setIsAuthenticated(true); // User already in state, so authenticated
        }
    }, [user, setUser]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Show loading while verifying session
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redirect if not authenticated
    }

    return children;
};

export default ProtectedRouteGuard;

*/
