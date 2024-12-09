import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

import useSnackbarStore from "../../stores/useSnackbarStore.js";

const SalesOrdersCreateModal = ({ open, onClose }) => {
    // Initial empty form data for creating a component
    const initialFormData = {
        productId: '',
        quantity: '',
        price: '',
    };

    const requiredFields = [
        'productId',
        'quantity',
        'price',
    ]; // Fields that cannot be empty

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    // const addSalesOrder = useSalesOrdersStore((state) => state.addSalesOrder());
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

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
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        console.log("triggered handle submit")

        /* const result = await createComponent(formData); // Send form data to backend to create a component

        if (!result) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }
        addComponent(result); */
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
                    Create a New Sales Order
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
                                            ['productId', 'quantity', 'price'].includes(field)
                                                ? 'number'
                                                : 'text'
                                        }
                                    />
                                </Grid>
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

export default SalesOrdersCreateModal;