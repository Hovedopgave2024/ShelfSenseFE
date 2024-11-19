import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material';
import useSessionStore from "../../stores/useSessionStore.js";
import {createComponent} from "../../util/services/componentService.js";

const ComponentsCreateModal = ({ open, onClose }) => {

    const [formData, setFormData] = useState({
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
    });

    const currentUser = useSessionStore((state) => state.user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            alert('User session not found!');
            return;
        }

        const componentData = { ...formData };

        const result = await createComponent(componentData);

        if (result) {
            alert('Component created successfully!');
            onClose(); // Close the modal
            window.location.reload(); // Reload the page to show the new component
        } else {
            alert('Failed to create component. Please try again.');
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
                    Create a New Component
                </Typography>
                <Grid container spacing={2}>
                    {Object.keys(formData).map((field) => (
                        <Grid item xs={12} sm={6} key={field}>
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
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Save Component
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsCreateModal;