// ProductsPage.js
import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';
import {Sidebar} from '../components/sidebar/sidebar.jsx';
import useSessionStore from "../stores/useSessionStore.js";

const ProductsPage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSessionStore((state) => state.user);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleNavigation = () => {
        navigate('/components');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Typography>Hello {user ? user.name : 'Guest'}</Typography>
            <Box
                sx={{
                    flexGrow: 1,
                    transition: 'margin-left 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{justifyContent: 'center'}}>
                    Our Products
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNavigation}
                    sx={{ mb: 3 }}
                >
                    Go to Components
                </Button>
                <ProductsList/>
            </Box>
        </Box>
    );
};

export default ProductsPage;