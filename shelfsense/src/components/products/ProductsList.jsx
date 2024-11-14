import {Skeleton, Stack} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../util/services/productService';
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
            spacing={6}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <>
                {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <Grid xs={12} md={6} key={index.toString()}>
                            <Stack spacing={1}>
                                <Skeleton animation="wave" variant="rectangular" width={210} height={120} />
                                <Skeleton variant="text" width={120} />
                                <Skeleton variant="circular" width={30} height={30} />
                            </Stack>
                        </Grid>
                    ))
                ) : (
                    products.map((product) => (
                        <Grid xs={12} sm={6} md={4} lg={3} key={product.id} sx={{mg: '10'}}>
                            <ProductsCard product={product} />
                        </Grid>
                    ))
                )}
            </>
        </Grid>
    );
};

export default ProductsList;