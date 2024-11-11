import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';

const ProductsPage = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/components');
    };

    return (
        <Container sx={{ py: 4 }}>
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
            <ProductsList />
        </Container>
    );
};

export default ProductsPage;