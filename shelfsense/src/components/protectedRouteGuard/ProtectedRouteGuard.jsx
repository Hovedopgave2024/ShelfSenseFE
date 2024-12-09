import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validateSession } from '../../util/services/Users/validateSession.js';
import useSessionStore from "../../stores/useSessionStore.js";
import { CircularProgress, Box } from '@mui/material';

const ProtectedRouteGuard = ({ children }) => {
    const user = useSessionStore((state) => state.user);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const verifySession = async () => {
            setIsAuthenticated(null);
            const sessionDTO = await validateSession();
            user && sessionDTO && user.id === sessionDTO.id ? setIsAuthenticated(true) : setIsAuthenticated(false);
        };

        (async () => {
            await verifySession();
        })();
    }, [user, location.pathname]);

    if (isAuthenticated === null) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full viewport height
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (!isAuthenticated) {
        console.error("Session expired or does not match the server session")
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRouteGuard;