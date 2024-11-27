import React from 'react';
import {Box, Button, Modal, Typography, List, ListItem, ListItemText, Chip, Stack,}
from '@mui/material';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { statusLabel } from '../../util/services/componentService.jsx'; // Adjust the import path as needed

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
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: 600,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
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

                {/* Components List */}
                <Typography variant="subtitle1" component="p" mb={1}>
                    Components:
                </Typography>

                <List>
                    {actualProduct.productComponentList.map((productComponent) => {
                        const component = components.find(
                            (c) => c.id === productComponent.componentId
                        );

                        if (!component) {
                            return (
                                <ListItem key={productComponent.id}>
                                    <ListItemText primary="Unknown Component" />
                                </ListItem>
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
                            <ListItem key={productComponent.id} alignItems="flex-start">
                                <ListItemText
                                    primary={component.name}
                                    secondary={
                                        <Stack direction="column" spacing={1} mt={1}>
                                            {/* Component Stock Status */}
                                            <Box>
                                                <Typography variant="caption" component="span" mr={1}>
                                                    Component Stock:
                                                </Typography>
                                                <Chip

                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        borderRadius: 1,
                                                        backgroundColor: stockStatus.color,
                                                        color: stockStatus.color,
                                                    }}
                                                    color={stockStatus.color}
                                                    label={stockStatus.label}
                                                    avatar={stockStatus.icon}
                                                />
                                            </Box>

                                            {/* Vendor Stock Status */}
                                            <Box>
                                                <Typography variant="caption" component="span" mr={1}>
                                                    Vendor Stock:
                                                </Typography>
                                                <Chip
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        borderRadius: 1,
                                                        backgroundColor: supplierStockStatus.color,
                                                        color: supplierStockStatus.color
                                                    }}
                                                    color={supplierStockStatus.color}
                                                    label={supplierStockStatus.label}
                                                    avatar={supplierStockStatus.icon}
                                                />
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>

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
