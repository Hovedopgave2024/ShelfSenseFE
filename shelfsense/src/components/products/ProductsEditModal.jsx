import { useState, useEffect } from 'react';
import useProductStore from '../../stores/useProductsStore.js';
import useComponentsStore from '../../stores/useComponentsStore.js';
import { updateProduct } from '../../util/services/ProductService.jsx';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Remove } from '@mui/icons-material';

function UpdateProductModal({ open, onClose, product }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
    });

    const [selectedComponents, setSelectedComponents] = useState([]);
    const componentsList = useComponentsStore((state) => state.components);
    const updateProductInStore = useProductStore((state) => state.updateProduct);

    // Preload product components when the modal opens
    useEffect(() => {
        if (product?.productComponentList) {
            const preloadedComponents = product.productComponentList.map((comp) => ({
                id: comp.id, // Existing component ID
                componentId: comp.componentId, // Associated component ID
                quantity: comp.quantity,
                productId: product.id,
            }));
            setSelectedComponents(preloadedComponents);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleComponentChange = (index, field, value) => {
        const updatedComponents = [...selectedComponents];

        if (field === 'componentId') {
            const selectedComponent = componentsList.find((comp) => comp.id === value);
            updatedComponents[index] = {
                ...updatedComponents[index],
                [field]: value,
                name: selectedComponent?.name || '', // Update the name
            };
        } else {
            updatedComponents[index] = {
                ...updatedComponents[index],
                [field]: value,
            };
        }

        setSelectedComponents(updatedComponents);
    };

    const handleAddComponent = () => {
        setSelectedComponents([
            ...selectedComponents,
            { componentId: '', quantity: '', productId: product.id }, // New component without ID
        ]);
    };

    const handleRemoveComponent = (index) => {
        const updatedComponents = [...selectedComponents];
        updatedComponents.splice(index, 1);
        setSelectedComponents(updatedComponents);
    };

    const handleSubmit = async () => {
        const payload = {
            id: product.id,
            name: formData.name,
            price: formData.price,
            productComponentList: selectedComponents.map((comp) => {
                if (comp.id) {
                    // Existing product component
                    return {
                        id: comp.id,
                        quantity: comp.quantity,
                        componentId: comp.componentId,
                        productId: comp.productId,
                    };
                } else {
                    // New product component
                    return {
                        quantity: comp.quantity,
                        componentId: comp.componentId,
                        productId: comp.productId,
                    };
                }
            }),
        };

        try {
            const response = await updateProduct(payload);
            if (response) {
                updateProductInStore(response);
                onClose();
            } else {
                alert('Failed to update product. Please try again.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred while updating the product.');
        }
    };

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
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '50vh',
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ ml: 5 }}>
                        Update Product
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        sx={{ ml: 5 }}
                    >
                        {/* Product Name */}
                        <Grid xs={12}>
                            <TextField
                                label="Name"
                                name="name"
                                variant="outlined"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Product Price */}
                        <Grid xs={12}>
                            <TextField
                                label="Price"
                                name="price"
                                variant="outlined"
                                fullWidth
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                            />
                        </Grid>

                        {/* Components Section */}
                        <Grid item xs={12} container justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" component="p">
                                Manage component(s)
                            </Typography>
                        </Grid>
                        {selectedComponents.map((comp, index) => (
                            <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="center"
                                justifyContent="center"
                            >
                                {/* Component Selection */}
                                <Grid item sx={{ minWidth: 210 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id={`component-select-label-${index}`}>
                                            Component
                                        </InputLabel>
                                        <Select
                                            variant="outlined"
                                            labelId={`component-select-label-${index}`}
                                            value={comp.componentId}
                                            label="Component"
                                            onChange={(e) =>
                                                handleComponentChange(index, 'componentId', e.target.value)
                                            }
                                        >
                                            {componentsList.map((component) => (
                                                <MenuItem key={component.id} value={component.id}>
                                                    {component.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Quantity Input */}
                                <Grid item xs={5}>
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        variant="outlined"
                                        fullWidth
                                        value={comp.quantity}
                                        onChange={(e) =>
                                            handleComponentChange(index, 'quantity', e.target.value)
                                        }
                                        type="number"
                                    />
                                </Grid>

                                {/* Remove Component Button */}
                                <Grid item xs={2}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveComponent(index)}
                                    >
                                        <Remove />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {/* Add Button */}
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddComponent}
                    sx={{ mt: 1, ml: 5, px: 4 }}
                >
                    Add Component
                </Button>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Update Product
                </Button>
            </Box>
        </Modal>
    );
}

export default UpdateProductModal;