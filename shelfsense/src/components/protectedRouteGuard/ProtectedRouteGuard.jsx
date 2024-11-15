import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateSession } from '../../util/services/userService.js';
import useSessionStore from "../../stores/useSessionStore.js";
import { CircularProgress, Box } from '@mui/material';

const ProtectedRouteGuard = ({ children }) => {
    const user = useSessionStore((state) => state.user);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            const sessionDTO = await validateSession();
            console.log("User:", user, "sessionDTO:", sessionDTO);
            user == null || sessionDTO == null || user.id !== sessionDTO.id ? setIsAuthenticated(false) : setIsAuthenticated(true);
        };

        (async () => {
            await verifySession();
        })();
    }, [user]);

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
        return <Navigate to="/login" replace />;
    }
    console.log("Session runs with user: ", user)
    return children;
};

export default ProtectedRouteGuard;