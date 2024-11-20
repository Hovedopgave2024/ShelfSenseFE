import {Skeleton, Stack, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProductsCard from "./ProductsCard";
import useProductsStore from "../../stores/useProductsStore.js";

const ProductsList = () => {
    const products = useProductsStore((state) => state.products);
    console.log(products);

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
            {products && products.length > 0 ? (
                products.map((product) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={product.id} sx={{mg: '10'}}>
                        <ProductsCard product={product} />
                    </Grid>
                ))
            ) : (
                <Stack alignItems="center" justifyContent="center" spacing={2}>
                    <Skeleton animation="wave" variant="rectangular" width={210} height={118} />
                    <Skeleton animation="wave" variant="text" width={210} />
                    <Typography>No products available</Typography>
                </Stack>
            )}
        </Grid>
    );
};

export default ProductsList;