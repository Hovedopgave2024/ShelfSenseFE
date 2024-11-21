import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { updateComponent } from "../../util/services/componentService.js";

const ComponentsEditModal = ({ open, onClose, component}) => {
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({}); // To track validation errors
    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);

    useEffect(() => {
        if (component) {
            setFormData(component);
            setErrors({}); // Reset errors when a new component is loaded
        }
    }, [component]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear errors for the specific field as the user types
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateFields = () => {
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
        ];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns `true` if no errors
    };

    const handleSubmit = async () => {
        if (!formData) return;

        if (!validateFields()) {
            // Stop submission if validation fails
            return;
        }

        const result = await updateComponent(formData.id, formData); // Update the component in the backend

        if (result) {
            updateComponentInStore(result); // Update the store with the updated component
            onClose(); // Close the modal
        } else {
            alert('Failed to update component. Please try again.');
        }
    };

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
                    Edit Component
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
                            {formData &&
                                Object.keys(formData).map((field) => (
                                        <Grid xs={12} lg={3} key={field}>
                                            <TextField
                                                label={field}
                                                name={field}
                                                variant="outlined"
                                                fullWidth
                                                value={formData[field] || ''}
                                                onChange={handleChange}
                                                type={
                                                    ['price', 'stock', 'safetyStock', 'safetyStockRop', 'supplierStock', 'supplierSafetyStock', 'supplierSafetyStockRop'].includes(field)
                                                        ? 'number'
                                                        : 'text'
                                                }
                                                error={!!errors[field]} // Highlight field in red if there's an error
                                                helperText={errors[field] || ''} // Display validation error message
                                            />
                                        </Grid>
                                    )
                                )}
                        </>
                    </Grid>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 'auto' }}
                    onClick={handleSubmit}
                >
                    Update Component
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsEditModal;