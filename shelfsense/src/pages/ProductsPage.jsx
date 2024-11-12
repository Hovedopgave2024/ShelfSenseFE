// ProductsPage.js
import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';
import Sidebar from '../components/sidebar/sidebar.jsx';

const drawerWidth = 200;
const collapsedWidth = 90;

const ProductsPage = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleNavigation = () => {
        navigate('/components');
    };

    return (
        <Box>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box
                component="main"
                sx={{
                    marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
                    transition: 'margin-left 0.3s',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
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