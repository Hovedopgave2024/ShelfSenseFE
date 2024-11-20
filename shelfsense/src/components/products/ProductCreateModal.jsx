import React, { useState } from 'react';
import useProductStore from '../../stores/useProductsStore.js';
import useComponentsStore from '../../stores/useComponentsStore.js';
import { createProduct } from '../../util/services/productService.js';
import { createProductComponents } from '../../util/services/productService.js';
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

function CreateProductModal({ open, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
    });
    const [selectedComponents, setSelectedComponents] = useState([]);

    const addProduct = useProductStore((state) => state.addProduct);
    const componentsList = useComponentsStore((state) => state.components);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleComponentChange = (index, field, value) => {
        const updatedComponents = [...selectedComponents];
        updatedComponents[index] = {
            ...updatedComponents[index],
            [field]: value,
        };
        setSelectedComponents(updatedComponents);
    };

    const handleAddComponent = () => {
        setSelectedComponents([...selectedComponents, { component_id: '', quantity: '' }]);
    };

    const handleRemoveComponent = (index) => {
        const updatedComponents = [...selectedComponents];
        updatedComponents.splice(index, 1);
        setSelectedComponents(updatedComponents);
    };

    const handleSubmit = async () => {
        // Step a: Create the product
        const productData = {
            name: formData.name,
            price: formData.price,
        };

        const productResult = await createProduct(productData);

        if (productResult) {
            // Step b: Receive the product ID
            const productId = productResult.id;

            // Step c: Create ProductComponents
            const productComponentsData = selectedComponents.map((comp) => ({
                product: { id: productId },
                component: { id: comp.component_id },
                quantity: comp.quantity,
            }));

            // Step d: Send ProductComponents to backend
            const productComponentsResult = await createProductComponents(productComponentsData);

            if (productComponentsResult) {
                // Optionally update your product store if needed
                addProduct({ ...productResult, productComponentsResult });
                onClose();
            } else {
                alert('Failed to associate components with the product. Please try again.');
            }
        } else {
            alert('Failed to create product. Please try again.');
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
                <Typography variant="h6" component="h2" mb={2}>
                    Create a New Product
                </Typography>
                <Grid container spacing={2}>
                    {/* Product Name */}
                    <Grid  xs={12}>
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
                    <Grid  xs={12}>
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
                    <Grid  sx={{minWidth: 195}}>
                        <Typography variant="subtitle1" component="p" >
                            Add component(s)
                        </Typography>
                    </Grid>

                    {selectedComponents.map((comp, index) => (
                        <Grid container spacing={2} key={index} alignItems="center">
                            {/* Component Selection */}
                            <Grid  sx={{minWidth: 195}}>
                                <FormControl fullWidth>
                                    <InputLabel id={`component-select-label-${index}`}>Component</InputLabel>
                                    <Select
                                        labelId={`component-select-label-${index}`}
                                        value={comp.component_id}
                                        label="Component"
                                        onChange={(e) =>
                                            handleComponentChange(index, 'component_id', e.target.value)
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
                            <Grid  xs={5}>
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
                            <Grid xs={2}>
                                <IconButton color="error" onClick={() => handleRemoveComponent(index)}>
                                    <Remove />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    {/* Add Component Button */}
                    <Grid xs={12}>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddComponent}
                            fullWidth
                        >
                            Add Component
                        </Button>
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Save Product
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateProductModal;
