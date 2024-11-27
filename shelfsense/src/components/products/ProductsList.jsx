import {Skeleton, Stack, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProductsCard from "./ProductsCard";
import useProductsStore from "../../stores/useProductsStore.js";
import DataManipulationBar from "../dataManipulationBar/DataManipulationBar.jsx";
import {useEffect, useState} from "react";

const ProductsList = () => {
    const products = useProductsStore((state) => state.products);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productSortParameters = ["Name", "Price"]


    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    return (
        <Grid
            container
            spacing={6}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxHeight: '80vh',
            }}
        >
            <DataManipulationBar
                data={products}
                onUpdate={setFilteredProducts}
                filterOptions={[
                    { key: 'name', label: 'Name', values: ["Hello World"]    },
                ]}
                sortOptions={productSortParameters.map((title) => ({
                    key: title.toLowerCase(),
                    label: title,
                }))}
            />
            {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((filteredProduct) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={filteredProduct.id} sx={{mg: '10'}}>
                        <ProductsCard product={filteredProduct} />
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