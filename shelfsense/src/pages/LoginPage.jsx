import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';
import { fetchAllData, login } from '../util/services/UserService.jsx';
import { useNavigate } from 'react-router-dom';
import useSessionStore from '../stores/useSessionStore';
import useSnackbarStore from '../stores/useSnackbarStore';

const LoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setGlobalUser = useSessionStore((state) => state.setUser);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    const handleNavigation = () => {
        navigate('/products');
    };

    const handleLogin = async () => {
        setLoading(true);

        const response = await login(name, password);

        if (!response) {
            showSnackbar('error', 'Username or password is wrong, please try again.');
            setLoading(false);
            return;
        }

        setGlobalUser(response);
        showSnackbar('success', 'Login successful, fetching your data. Please wait...');
        await fetchAllData();
        setLoading(false);
        handleNavigation();
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
            <Card sx={{ maxWidth: 400, padding: 2 }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>

                    <Box mt={2}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    <Box mt={2}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>

                    <Box mt={4} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLogin}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;