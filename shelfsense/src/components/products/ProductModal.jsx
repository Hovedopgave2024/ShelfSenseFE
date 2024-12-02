import React from 'react';
import { Box, Button, Modal, Typography, Chip, Stack, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { statusLabel } from '../../util/services/ComponentService.jsx'; // Adjust the import path as needed

function ProductModal({ open, onClose, product }) {
    const actualProduct = product.product; // Extract the product object
    const components = useComponentsStore((state) => state.components);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: 600,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h7" component="h2" mb={2}>
                    Product Details
                </Typography>

                {/* Product Name */}
                <Typography variant="subtitle1" component="p">
                    <strong>Name:</strong> {actualProduct.name}
                </Typography>

                {/* Product Price */}
                <Typography variant="subtitle1" component="p" mb={2}>
                    <strong>Price:</strong> ${actualProduct.price}
                </Typography>

                {/* Components Grid */}
                <Typography variant="h6" component="h2" mb={2}>
                    Components:
                </Typography>

                <Grid container spacing={2}>
                    {actualProduct.productComponentList
                        .map((productComponent) => {
                            const component = components.find(
                                (c) => c.id === productComponent.componentId
                            );

                            if (!component) {
                                return {
                                    productComponent,
                                    component: null,
                                    stockStatusValue: Infinity,
                                    supplierStockStatusValue: Infinity,
                                };
                            }

                            const stockStatusValue = component.stockStatus || Infinity; // Use Infinity if no stockStatus
                            const supplierStockStatusValue = component.supplierStockStatus || Infinity; // Use Infinity if no supplierStockStatus

                            return {
                                productComponent,
                                component,
                                stockStatusValue,
                                supplierStockStatusValue,
                            };
                        })
                        .sort((a, b) => {
                            // Sort by stockStatus first, then by supplierStockStatus
                            if (a.stockStatusValue !== b.stockStatusValue) {
                                return a.stockStatusValue - b.stockStatusValue;
                            }
                            return a.supplierStockStatusValue - b.supplierStockStatusValue;
                        })
                        .map(({ productComponent, component }) => {
                            if (!component) {
                                return (
                                    <Grid item xs={12} key={productComponent.id}>
                                        <Typography variant="body2">Unknown Component</Typography>
                                    </Grid>
                                );
                            }

                        // Retrieve stockStatus and supplierStockStatus
                        const stockStatusValue = component.stockStatus;
                        const supplierStockStatusValue = component.supplierStockStatus;

                        // Get status details using statusLabel
                        const stockStatus = stockStatusValue
                            ? statusLabel(stockStatusValue)
                            : statusLabel(null);
                        const supplierStockStatus = supplierStockStatusValue
                            ? statusLabel(supplierStockStatusValue)
                            : statusLabel(null);

                        return (
                            <Grid item xs={6} key={productComponent.id}>
                                <Box
                                    border={1} borderColor="divider" borderRadius={2} p={2}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {component.name} / {component.manufacturerPart}
                                    </Typography>

                                    <Stack direction="column" spacing={1} mt={1}>
                                        {/* Component Stock Status */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Typography variant="caption" component="span" mr={1}>
                                                Component Stock:
                                            </Typography>
                                            <Chip
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    borderRadius: 1,
                                                    width: 100,
                                                    backgroundColor: stockStatus.color,
                                                    color: "white",
                                                }}
                                                color={stockStatus.color}
                                                label={stockStatus.label}
                                                avatar={stockStatus.icon}
                                            />
                                        </Box>

                                        {/* Vendor Stock Status */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Typography variant="caption" component="span" mr={1}>
                                                Vendor Stock:
                                            </Typography>
                                            <Chip
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    borderRadius: 1,
                                                    width: 100,
                                                    backgroundColor: supplierStockStatus.color,
                                                    color: "white",
                                                }}
                                                color={supplierStockStatus.color}
                                                label={supplierStockStatus.label}
                                                avatar={supplierStockStatus.icon}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Close Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={onClose}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

export default ProductModal;
