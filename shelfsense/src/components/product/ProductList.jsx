import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { fetchProducts } from '../../api/productApi';
import ProductCard from "./ProductCard";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const productsData = await fetchProducts();
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setTimeout(() => { // for sjov for at se animationerne
                setLoading(false);
            }, 5000);
        }
    };

    useEffect(() => {
        (async () => {
            await loadProducts();
        })();
    }, []);
 //
    return (
            <Grid
                container
                spacing={2}
                // justifyContent="center"
                // alignItems="center"
            >
                {loading ? (
                    <>
                        {[...Array(8)].map((_, index) => (
                            <Grid item size={{ xs: 12, md: 6 }} key={index}>
                                <Stack spacing={1}>
                                    <Skeleton animation="wave" variant="rectangular" width={210} height={120} />
                                    <Skeleton variant="text" width={120} />
                                    <Skeleton variant="circular" width={30} height={30} />
                                </Stack>
                            </Grid>
                        ))}
                    </>
                ) : (
                    products.map((product) => (
                        <Grid item size={{ xs: 12, md: 6 }} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))
                )}
            </Grid>
    );
};

export default ProductList;