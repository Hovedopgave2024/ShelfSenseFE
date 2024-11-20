// ProductsPage.js
import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';
import { Sidebar } from '../components/sidebar/sidebar.jsx';
import useSessionStore from "../stores/useSessionStore.js";
import ProductCreateModal from '../components/products/ProductCreateModal.jsx'; // Import the modal

const ProductsPage = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const user = useSessionStore((state) => state.user);

    const toggleDrawer = () => {
        setOpenSideBar((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    }

    const handleNavigation = () => {
        navigate('/components');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={openSideBar} toggleDrawer={toggleDrawer} />
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
                <Typography variant="h6" align="right" sx={{ width: '100%', mb: 2 }}>
                    Hello {user ? user.name : 'Guest'}
                </Typography>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleModal}
                    sx={{ mb: 3 }}
                >
                    Create Product
                </Button>
                <ProductsList />
                {/* Render the modal here */}
                <ProductCreateModal open={openModal} onClose={toggleModal} />
            </Box>
        </Box>
    );
};

export default ProductsPage;
