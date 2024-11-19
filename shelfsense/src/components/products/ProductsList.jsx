import { Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/grid2';
import ProductsCard from "./ProductsCard";
import useProductsStore from "../../stores/useProductsStore.js";

const ProductsList = () => {
    const products = useProductsStore((state) => state.products);

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
            {products.length > 0 ? (
                products.map((product) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={product.id} sx={{mg: '10'}}>
                        <ProductsCard product={product} />
                    </Grid>
                ))
            ) : (
                <Stack spacing={2} sx={{ width: '100%', alignItems: 'center', marginTop: 5 }}>
                    {/* Fallback UI for empty products */}
                    <Skeleton variant="rectangular" width={210} height={118} sx={{ borderRadius: 1 }} />
                    <p>No products available.</p>
                </Stack>
            )}
        </Grid>
    );
};

export default ProductsList;