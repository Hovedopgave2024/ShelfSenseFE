import { useState, useEffect } from 'react';
import useComponentsStore from '../../stores/useComponentsStore.js';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    FormControl,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Delete, Remove } from '@mui/icons-material';
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import { deleteProduct } from '../../services/product/deleteProduct.js';
import { updateProduct } from '../../services/product/updateProduct.js';
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from '@mui/material/Autocomplete'; // <-- NEW

function UpdateProductModal({ open, onClose, product }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
    });
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [errors, setErrors] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);

    const componentsList = useComponentsStore((state) => state.components);
    const updateProductStore = useProductsStore((state) => state.updateProduct);
    const deleteProductStore = useProductsStore((state) => state.deleteProduct);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    const handleCloseDialog = () => setDialogOpen(false);

    // Preload product components when the modal opens
    useEffect(() => {
        if (product?.productComponentList) {
            const preloadedComponents = product.productComponentList.map((pc) => ({
                id: pc.id, // Existing "product_component" ID (if your DB has it)
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

        updatedComponents[index] = {
            ...updatedComponents[index],
            [field]: value,
        };

        setSelectedComponents(updatedComponents);
    };

    const handleAddComponent = () => {
        setSelectedComponents((prevComponents) => [
            ...prevComponents,
            { componentId: '', quantity: '', productId: product.id },
        ]);
    };

    const handleRemoveComponent = (index) => {
        const updatedComponents = [...selectedComponents];
        updatedComponents.splice(index, 1);
        setSelectedComponents(updatedComponents);
    };

    const validateFields = () => {
        let hasError = false;
        const fieldErrors = {};

        // Validate product fields
        if (!formData.name.trim()) {
            fieldErrors.name = 'Name is required.';
            hasError = true;
        }
        if (
            formData.price == null ||
            formData.price === '' ||
            isNaN(formData.price) ||
            formData.price <= 0
        ) {
            fieldErrors.price = 'Valid price is required.';
            hasError = true;
        }

        // Validate component fields
        selectedComponents.forEach((component, index) => {
            if (!component.componentId) {
                fieldErrors[`componentId_${index}`] = 'Component is required.';
                hasError = true;
            }
            if (
                !component.quantity ||
                isNaN(component.quantity) ||
                component.quantity <= 0
            ) {
                fieldErrors[`quantity_${index}`] = 'Valid quantity is required.';
                hasError = true;
            }
        });

        setErrors(fieldErrors);
        return !hasError;
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            showSnackbar('warning', 'Please fill out all required fields and try again');
            return;
        }

        const payload = {
            id: product.id,
            name: formData.name,
            price: formData.price,
            productComponentList: selectedComponents.map((comp) => ({
                id: comp.id, // might be undefined for new ones
                quantity: comp.quantity,
                componentId: comp.componentId,
                productId: comp.productId,
            })),
        };

        const updateProductResult = await updateProduct(payload);

        if (!updateProductResult) {
            showSnackbar('error', 'Error: Product was not updated. Please try again or contact Support');
            return;
        }
        updateProductStore(updateProductResult);
        showSnackbar('success', 'Product updated successfully.');
        onClose();
    };

    const handleDeleteProduct = async () => {
        setDialogOpen(true);
    };

    const confirmDeleteProduct = async () => {
        setDialogOpen(false);
        const payload = { id: product.id };
        const deleteProductResult = await deleteProduct(payload);

        if (!deleteProductResult) {
            showSnackbar('error', 'Error: Product was not deleted. Please try again or contact Support');
            return;
        }
        deleteProductStore(product.id);
        showSnackbar('success', 'Product deleted successfully.');
        onClose();
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
                    borderRadius: 3,
                    minWidth: 200,
                    maxWidth: 650,
                }}
            >
                {/* Close Button */}
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'grey.500',
                    }}
                >
                    <CloseIcon />
                </Button>

                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '50vh',
                        mb: 1,
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
                                error={!!errors.name}
                                helperText={errors.name}
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
                                error={!!errors.price}
                                helperText={errors.price}
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
                                {/* Component Selection (Autocomplete) */}
                                <Grid xs={12} sm={6} sx={{ minWidth: 210 }}>
                                    <Autocomplete
                                        // Filter out components that are already selected (except the current one)
                                        options={componentsList.filter((component) =>
                                            !selectedComponents.some(
                                                (selected) =>
                                                    selected.componentId === component.id &&
                                                    selected.componentId !== comp.componentId
                                            )
                                        )}
                                        getOptionLabel={(option) =>
                                            `${option.name} (${option.manufacturerPart})`
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.id === value.id
                                        }
                                        // Match the selected component by ID
                                        value={
                                            comp.componentId
                                                ? componentsList.find(
                                                (c) => c.id === comp.componentId
                                            ) || null
                                                : null
                                        }
                                        onChange={(e, newValue) => {
                                            handleComponentChange(
                                                index,
                                                'componentId',
                                                newValue ? newValue.id : ''
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Component"
                                                variant="outlined"
                                                error={!!errors[`componentId_${index}`]}
                                                helperText={errors[`componentId_${index}`]}
                                            />
                                        )}
                                    />
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
                                        error={!!errors[`quantity_${index}`]}
                                        helperText={errors[`quantity_${index}`]}
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

                {/* Action Buttons */}
                <Grid
                    container
                    xs={12}
                    sm={6}
                    alignItems="center"
                    justifyContent="space-around"
                    direction={{ xs: 'column', sm: 'row' }}
                >
                    {/* Add Component Button */}
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Add />}
                        onClick={handleAddComponent}
                        sx={{ px: 4, mt: 2 }}
                    >
                        Add Component
                    </Button>

                    {/* Delete Product Button */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteProduct}
                        sx={{ px: 4, mt: 2 }}
                    >
                        Delete Product
                    </Button>

                    {/* Confirm Deletion Dialog */}
                    <ConfirmDialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        headline="Confirm Deletion"
                        text="Are you sure you want to delete this product? This action cannot be undone."
                        onAccept={confirmDeleteProduct}
                        onDecline={handleCloseDialog}
                        acceptText="Delete"
                        declineText="Cancel"
                    />
                </Grid>

                {/* Update Product Button */}
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
