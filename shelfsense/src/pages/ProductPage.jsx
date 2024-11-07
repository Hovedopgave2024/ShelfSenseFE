import React from 'react';
import { Container, Typography } from '@mui/material';
import ProductList from '../components/product/ProductList';

const ProductsPage = () => (
    <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Our Products
        </Typography>
        <ProductList />
    </Container>
);

export default ProductsPage;
