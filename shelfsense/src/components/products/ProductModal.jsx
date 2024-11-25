import React from 'react';
import { Box, Button, Modal, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { stockCalculator } from '../../util/services/componentService.jsx';

function ProductModal({ open, onClose, product }) {
    const actualProduct = product.product; // Extract the product object

    const components = useComponentsStore((state) => state.components);

    if (!actualProduct) {
        return null; // Handle case where product is undefined
    }

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

                        const { label, color } = stockCalculator(
                            component.stock,
                            component.safetyStock,
                            component.safetyStockRop
                        );

                        // Skip rendering if the status is 'success'
                        if (color === 'success') {
                            return null;
                        }

                        // Determine if the label is 'Critical Stock Level'
                        const isCritical = label === 'Critical Stock Level';

                        return (
                            <ListItem key={productComponent.id}>
                                <ListItemText
                                    primary={component.name}
                                    secondary={
                                        <Chip
                                            label={label}
                                            sx={{
                                                fontSize: '0.8rem',
                                                borderRadius: 1,
                                                backgroundColor: isCritical ? 'black' : undefined,
                                                color: isCritical ? 'white' : undefined,
                                            }}
                                            color={isCritical ? 'default' : color}
                                            variant="filled"
                                        />
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
