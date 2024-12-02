import { useState } from 'react';
import useProductStore from '../../stores/useProductsStore.js';
import useComponentsStore from '../../stores/useComponentsStore.js';
import { createProduct } from '../../util/services/ProductService.jsx';
import { createProductComponents } from '../../util/services/ProductService.jsx';
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
import useSnackbarStore from "../../stores/useSnackbarStore.js";

function CreateProductModal({ open, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
    });
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [errors, setErrors] = useState({});
    const addProduct = useProductStore((state) => state.addProduct);
    const componentsList = useComponentsStore((state) => state.components);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

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

    const validateFields = () => {
        let hasError = false;
        const fieldErrors = {};

        // Validate product fields
        if (!formData.name.trim()) {
            fieldErrors.name = 'Name is required.';
            hasError = true;
        }
        if (formData.price == null || formData.price === '' || isNaN(formData.price) || formData.price <= 0) {
            fieldErrors.price = 'Valid price is required.';
            hasError = true;
        }

        // Validate component fields
        selectedComponents.forEach((component, index) => {
            if (!component.component_id) {
                fieldErrors[`component_id_${index}`] = 'Component is required.';
                hasError = true;
            }
            if (!component.quantity || isNaN(component.quantity) || component.quantity <= 0) {
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

        // Step a: Create the product
        const productData = {
            name: formData.name,
            price: formData.price,
        };

        const productResult = await createProduct(productData);

        if (!productResult){
            showSnackbar('error', 'Error: Product was not created. Please try again or contact Support');
            return;
        }

        const productId = productResult.id;

        // Step c: Create ProductComponents
        const productComponentsData = selectedComponents.map((comp) => ({
            product: { id: productId },
            component: { id: comp.component_id },
            quantity: comp.quantity,
        }));

        // Step d: Send ProductComponents to backend
        const productComponentsResult = await createProductComponents(productComponentsData);

        if (!productComponentsResult){
            showSnackbar('error', 'Error: Failed to associate components with the product. Please try again or contact Support');
            return;
        }
        addProduct({ ...productResult, productComponentList: productComponentsResult });
        showSnackbar('success', 'Product created successfully.');
        setFormData({name: '', price: ''});
        setSelectedComponents([]);
        setErrors({});
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
                        Create a New Product
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
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        {/* Product Price */}
                        <Grid xs={12} sm={6}>
                            <TextField
                                label="Price"
                                name="price"
                                variant="outlined"
                                fullWidth
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        {/* Components Section */}
                        <Grid xs={12} sx={{ width: '100%' }}>
                                <Typography variant="subtitle1" component="p" sx={{ width: '100%' }}>
                                    Add component(s)
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
                                            value={comp.component_id}
                                            label="Component"
                                            onChange={(e) =>
                                                handleComponentChange(index, 'component_id', e.target.value)
                                            }
                                        >
                                            {componentsList
                                                .filter((component) => !selectedComponents.some((selected) => selected.component_id === component.id && selected.component_id !== comp.component_id))
                                                .map((component) => (
                                                <MenuItem key={component.id} value={component.id}>
                                                    <>
                                                        {component.name} <br /> ({component.manufacturerPart})
                                                    </>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Typography color="error" variant="caption">
                                            {errors[`component_id_${index}`]}
                                        </Typography>
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
                {/* Add Button */}
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddComponent}
                    sx={{mt: 1, ml: 5, px: 4}}
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
                    Save Product
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateProductModal;
