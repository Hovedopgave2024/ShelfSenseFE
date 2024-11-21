import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { updateComponent } from "../../util/services/componentService.js";

const ComponentsEditModal = ({ open, onClose, component}) => {
    const [formData, setFormData] = useState(null);
    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);

    useEffect(() => {
        if (component) {
            setFormData(component);
        }
    }, [component]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
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
                                    field !== 'id' && ( // Exclude the 'id' field from being editable
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
                    Update Component
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsEditModal;