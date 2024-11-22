import React from 'react';
import {Box, Button, Modal, Typography, List, ListItem, ListItemText,} from '@mui/material';
import useProductsStore from "../../stores/useProductsStore.js";


function ProductModal({ open, onClose, product }) {
    if (!product) {
        return null; // Handle case where product is undefined
    }

    console.log('Product in Modal:', product);

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
                    <strong>Name:</strong> {product.name}
                </Typography>

                {/* Product Price */}
                <Typography variant="subtitle1" component="p" mb={2}>
                    <strong>Price:</strong> ${product.price}
                </Typography>

                {/* Components List */}
                <Typography variant="subtitle1" component="p" mb={1}>
                    Components:
                </Typography>
                <List>
                    {product && product.productComponentList && product.productComponentList.length > 0 ? (
                        product.productComponentList.map((comp, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={comp.component.name}
                                    secondary={`Quantity: ${comp.quantity}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No components associated with this product.
                        </Typography>
                    )}
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
