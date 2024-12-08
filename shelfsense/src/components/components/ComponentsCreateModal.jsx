import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';

import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../util/services/components/createComponent.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

const ComponentsCreateModal = ({ open, onClose }) => {
    // Initial empty form data for creating a component
    const initialFormData = {
        name: '',
        type: '',
        footprint: '',
        manufacturerPart: '',
        price: 0,
        supplier: '',
        stock: 0,
        safetyStock: 0,
        safetyStockRop: 0,
        supplierSafetyStock: 0,
        supplierSafetyStockRop: 0,
        designator: '',
        manufacturer: '',
        supplierPart: '',
    };

    const requiredFields = [
        'name',
        'type',
        'footprint',
        'manufacturerPart',
        'price',
        'supplier',
        'stock',
        'safetyStock',
        'safetyStockRop',
    ]; // Fields that cannot be empty

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [uniqueSuppliers, setUniqueSuppliers] = useState([]); // Store unique suppliers
    const addComponent = useComponentsStore((state) => state.addComponent);
    const components = useComponentsStore((state) => state.components); // Retrieve components from the store
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    // Extract unique suppliers from components
    useEffect(() => {
        const suppliers = [...new Set(components.map((comp) => comp.supplier))]; // Get unique supplier names
        setUniqueSuppliers(['None', ...suppliers.filter(Boolean)]); // Add "None" as a hardcoded option and remove null/empty
    }, [components]);

    // Handle changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear the error when the user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `Required`; // Error message for empty fields
            }
        });
        setErrors(newErrors);
        showSnackbar('warning', 'Please fill out all required fields and try again');
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        const result = await createComponent(formData); // Send form data to backend to create a component

        if (!result) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }
        addComponent(result);
        showSnackbar('success', 'Component created successfully');
        onClose();
        setFormData(initialFormData);
        setErrors({});
    };

    // Reset form data and errors when the modal opens
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box alignItems="center" justifyContent="center"
                sx={{
                    position: 'absolute',
                    maxHeight: '80vh',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
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
                <Typography variant="h6" component="h2" mb={2}>
                    Create a New Component
                </Typography>
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
                        mb: 3,
                    }}
                >
                    <Grid container alignItems="center" justifyContent="center" spacing={2}>
                        <>
                            {Object.keys(formData).map((field) => (
                                field === 'supplier' ? (
                                    <Grid xs={12} lg={3} key={field}>
                                        <FormControl
                                            sx={{ width: 195 }}
                                            error={!!errors[field]}
                                        >
                                            <Autocomplete
                                                freeSolo
                                                options={uniqueSuppliers}
                                                value={formData.supplier || ''}
                                                onChange={(e, newValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        supplier: newValue || '',
                                                    }));
                                                    // Clear the error when a new value is selected
                                                    if (errors.supplier) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            supplier: null,
                                                        }));
                                                    }
                                                }}
                                                onInputChange={(e, newInputValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        supplier: newInputValue || '',
                                                    }));
                                                    // Clear the error when the user starts typing
                                                    if (errors.supplier) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            supplier: null,
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Supplier"
                                                        name="supplier"
                                                        variant="outlined"
                                                        error={!!errors.supplier}
                                                        helperText={errors.supplier || ''}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                ) : (
                                <Grid xs={12} lg={3} key={field}>
                                    <TextField
                                        label={requiredFields.includes(field)
                                            ? `${field} *`
                                            : field}
                                        name={field}
                                        variant="outlined"
                                        sx={{ width: 195 }}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        error={!!errors[field]} // Adds red border if there’s an error
                                        helperText={errors[field] || ''} // Displays error message below the field
                                        type={
                                            ['price', 'stock', 'safetyStock', 'safetyStockRop', 'supplierSafetyStock', 'supplierSafetyStockRop'].includes(field)
                                                ? 'number'
                                                : 'text'
                                        }
                                    />
                                </Grid>
                                )
                            ))}
                        </>
                    </Grid>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 'auto' }}
                    onClick={handleSubmit}
                >
                    Save Component
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsCreateModal;