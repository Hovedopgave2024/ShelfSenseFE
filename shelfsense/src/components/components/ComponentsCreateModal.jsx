import React, {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button, Grid, TextField } from '@mui/material/';
import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../util/services/componentService.js";

const ComponentsCreateModal = ({ open, onClose }) => {
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

    const [formData, setFormData] = useState(initialFormData);
    const addComponent = useComponentsStore((state) => state.addComponent);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const result = await createComponent(formData);

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
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: 600,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    Create a New Component
                </Typography>
                <Grid container spacing={2}>
                    <>
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
                    </>
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