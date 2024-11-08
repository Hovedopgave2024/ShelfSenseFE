// src/components/ProductsCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ProductsCard = ({ product }) => (
    <Card>
        <CardMedia
            component="img"
            height="150"
            image={product.picture != null ? product.picture : `${process.env.PUBLIC_URL}/defaultPic1.jpeg`}
            alt={product.name}
        />
        <CardContent>
            <Typography variant="h6" component="div">
                {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
                ${product.price}
            </Typography>
        </CardContent>
    </Card>
);

export default ProductsCard;
