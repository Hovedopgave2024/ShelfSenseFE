import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { fetchProducts } from '../../services/productService';
import ProductsCard from "./ProductsCard";

const ProductsList = () => {
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
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadProducts();
        })();
    }, []);

    return (
            <Grid
                container
                spacing={2}

            >
                {loading ? (
                    <>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Grid xs={12} md={6} key={index}>
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
                        <Grid xs={12} md={6} lg={3} key={product.id}>
                            <ProductsCard product={product} />
                        </Grid>
                    ))
                )}
            </Grid>
    );
};

export default ProductsList;