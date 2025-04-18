import {useEffect, useState} from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, CircularProgress } from '@mui/material';
import { fetchAllData } from '../services/user/fetchAllData.js';
import { login } from '../services/user/login.js';
import { useNavigate } from 'react-router-dom';
import useSessionStore from '../stores/useSessionStore';
import useSnackbarStore from '../stores/useSnackbarStore';
import useComponentsStore from "../stores/useComponentsStore.js";
import useProductsStore from "../stores/useProductsStore.js";
import useSalesOrdersStore from "../stores/useSalesOrdersStore.js";
import useApiUpdateStore from "../stores/useApiUpdateStore.js";
import calculateStatus from "../util/component/calculateStockStatus.js";

const LoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [expectingData, setExpectingData] = useState(false);
    const [dataLength, setDataLength] = useState({
        components: 0,
        products: 0,
        salesOrders: 0,
        apiUpdate: 0,
    });
    const navigate = useNavigate();
    const setGlobalUser = useSessionStore((state) => state.setUser);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const getComponents = useComponentsStore((state) => state.components);
    const setComponents = useComponentsStore((state) => state.setComponents);
    const getProducts = useProductsStore((state) => state.products);
    const setProducts = useProductsStore((state) => state.setProducts);
    const getSalesOrders = useSalesOrdersStore((state) => state.salesOrders);
    const setSalesOrders = useSalesOrdersStore((state) => state.setSalesOrders);
    const setApiUpdate = useApiUpdateStore((state) => state.setApiUpdate);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const loginResponse = await login(name, password);
            if (!loginResponse) {
                showSnackbar('error', 'Login failed. Please check your credentials.');
                return;
            }

            setGlobalUser(loginResponse);
            showSnackbar('success', 'Login successful. Fetching your data, please wait...');

            const dataFetched = await fetchAllData();
            if (!dataFetched) {
                setLoading(false);
                return;
            }

            const processedComponents = dataFetched.components.map(component => ({
                ...component,
                stockStatus: calculateStatus(
                    parseInt(component.stock),
                    parseInt(component.safetyStock),
                    parseInt(component.safetyStockRop)
                ),
                supplier: {
                    ...component.supplier,
                    stockStatus: component.supplier?.stock != null
                        ? calculateStatus(
                            parseInt(component.supplier.stock),
                            parseInt(component.supplier.safetyStock),
                            parseInt(component.supplier.safetyStockRop)
                        )
                        : null
                }
            }));

            setComponents(processedComponents);
            setProducts(dataFetched.products);
            setSalesOrders(dataFetched.salesOrders);
            setApiUpdate(dataFetched.apiUpdate);

            setDataLength({
                components: processedComponents.length,
                products: dataFetched.products.length,
                salesOrders: dataFetched.salesOrders.length,
                apiUpdate: dataFetched.apiUpdate,
            });

            setExpectingData(true);

        } catch (error) {
            console.error('Unexpected error during login process:', error);
            showSnackbar('error', 'An unexpected error occurred. Please try again or contact Support.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expectingData) {
            const ready =
                getComponents.length === dataLength.components &&
                getProducts.length === dataLength.products &&
                getSalesOrders.length === dataLength.salesOrders;

            if (ready) {
                setLoading(false);
                setExpectingData(false);
                navigate('/products');
            }
        }
    }, [expectingData, dataLength]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
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