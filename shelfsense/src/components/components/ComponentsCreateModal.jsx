import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../util/services/ComponentService.jsx";

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
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        const result = await createComponent(formData); // Send form data to backend to create a component

        if (result) {
            addComponent(result); // Update the store with the new component
            onClose(); // Close the modal
            setFormData(initialFormData); // Reset the form
            setErrors({}); // Clear errors
        } else {
            alert('Failed to create component. Please try again.');
        }
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
            <Box
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
                                            fullWidth
                                            sx={{ minWidth: 195 }}
                                            error={!!errors[field]}
                                        >
                                            <InputLabel>Supplier</InputLabel>
                                            <Select
                                                name={field}
                                                value={formData[field] || ''}
                                                onChange={handleChange}
                                                label="Supplier"
                                                fullWidth
                                            >
                                                {uniqueSuppliers.map((supplier) => (
                                                    <MenuItem key={supplier} value={supplier}>
                                                        {supplier}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors[field] && <FormHelperText>Required</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                ) : (
                                <Grid xs={12} lg={3} key={field}>
                                    <TextField
                                        label={field}
                                        name={field}
                                        variant="outlined"
                                        fullWidth
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