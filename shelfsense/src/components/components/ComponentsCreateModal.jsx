import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../util/services/componentService.jsx";

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

    const [formData, setFormData] = useState(initialFormData); // State to hold form data
    const addComponent = useComponentsStore((state) => state.addComponent); // Zustand method to update the components store

    // Handle changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        const result = await createComponent(formData); // Send form data to backend to create a component

        if (result) {
            addComponent(result); // Update the store with the new component
            onClose(); // Close the modal
            setFormData(initialFormData); // Reset the form
        } else {
            alert('Failed to create component. Please try again.');
        }
    };

    // Reset form data when the modal opens
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
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
                                <Grid xs={12} lg={3} key={field}>
                                    <TextField
                                        label={field}
                                        name={field}
                                        variant="outlined"
                                        fullWidth
                                        value={formData[field]}
                                        onChange={handleChange}
                                        type={
                                            ['price', 'stock', 'safetyStock', 'safetyStockRop', 'supplierStock', 'supplierSafetyStock', 'supplierSafetyStockRop'].includes(field)
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