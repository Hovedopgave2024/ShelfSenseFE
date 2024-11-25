import React from 'react';
import {Box, Button, Modal, Typography, List, ListItem, ListItemText,} from '@mui/material';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { stockCalculator } from '../../util/services/componentService.jsx';



function ProductModal({ open, onClose, product }) {
    const actualProduct = product?.product; // Extract the product object from the nested structure

    const components = useComponentsStore((state) => state.components);

    if (!actualProduct) {
        return null; // Handle case where product is undefined
    }

    console.log('Actual Product in Modal:', actualProduct);

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
                            component.safetyStockROP
                        );

                        // Mapping for background and text colors
                        const backgroundColors = {
                            success: 'green',
                            warning: 'yellow',
                            error: 'black',
                            low: 'red',
                        };

                        const textColors = {
                            success: 'white',
                            warning: 'black',
                            error: 'white',
                            low: 'white',
                        };

                        const bgColor = backgroundColors[color] || 'grey';
                        const textColor = textColors[color] || 'white';

                        return (
                            <ListItem key={productComponent.id}>
                                <ListItemText
                                    primary={component.name}
                                    secondary={
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                backgroundColor: bgColor,
                                                color: textColor,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {label}
                                        </Box>
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
