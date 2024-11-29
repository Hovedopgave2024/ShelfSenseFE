import { useState, useEffect } from 'react';
import useComponentsStore from '../../stores/useComponentsStore.js';
import {deleteProduct, updateProduct} from '../../util/services/ProductService.jsx';
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
import {Add, Delete, Remove} from '@mui/icons-material';

function UpdateProductModal({ open, onClose, product }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
    });

    const [selectedComponents, setSelectedComponents] = useState([]);
    const componentsList = useComponentsStore((state) => state.components);

    // Preload product components when the modal opens
    useEffect(() => {
        if (product?.productComponentList) {
            const preloadedComponents = product.productComponentList.map((pc) => ({
                id: pc.id, // Existing component ID
                componentId: pc.componentId, // Associated component ID
                quantity: pc.quantity,
                productId: pc.productId,
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
        setSelectedComponents((prevComponents) => [
            ...prevComponents,
            { componentId: '', quantity: '', productId: product.id }, // New component
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

        await updateProduct(payload);
        onClose();
    };

    const handleDeleteProduct = async () => {
        const payload = {
            id: product.id
        }
        console.log(payload);
        await deleteProduct(payload);
        onClose();
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
                    minWidth: 200,
                    maxWidth: 600,
                }}
            >
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '50vh',
                        mb: 1
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ ml: 5, mb: 2 }}>
                        Update Product
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        sx={{ ml: 5 }}
                        direction={{ xs: 'column', sm: 'row' }}
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
                                xs={12} sm={6}
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
                        <Grid xs={12} sx={{ width: '100%' }}>
                            <Typography variant="subtitle1" component="p" sx={{ width: '100%' }}>
                                Manage component(s)
                            </Typography>
                        </Grid>
                        {selectedComponents.map((comp, index) => (
                            <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="flex-start"
                                justifyContent="flex-start"
                                direction={{ xs: 'column', sm: 'row' }}
                            >
                                {/* Component Selection */}
                                <Grid xs={12} sm={6} sx={{ minWidth: 210 }}>
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
                                            {componentsList
                                                .filter((component) => !selectedComponents.some((selected) => selected.componentId === component.id && selected.componentId !== comp.componentId))
                                                .map((component) => (
                                                <MenuItem key={component.id} value={component.id}>
                                                    {component.name}
                                                </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Quantity Input */}
                                <Grid xs={12} sm={6}>
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
                                <Grid xs={12} sm={6}>
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
                <Grid
                    container
                    item
                    xs={12}
                    sm={6}
                    alignItems="center"
                    justifyContent="space-around"
                    direction={{ xs: 'column', sm: 'row' }} // Stacks buttons on small screens
                >
                    {/* Add Button */}
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<Add />}
                            onClick={handleAddComponent}
                            sx={{ px: 4, mt: 2 }}
                        >
                            Add Component
                        </Button>
                    {/* Delete Button */}
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            onClick={handleDeleteProduct}
                            sx={{ px: 4, mt: 2 }}
                        >
                            Delete Product
                        </Button>
                </Grid>

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