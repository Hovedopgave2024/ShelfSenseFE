import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import {updateComponent, deleteComponent} from "../../util/services/ComponentService.jsx";

const ComponentsEditModal = ({ open, onClose, component}) => {
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [uniqueSuppliers, setUniqueSuppliers] = useState([]); // Store unique suppliers

    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);
    const deleteComponentInStore = useComponentsStore((state) => state.deleteComponent);
    const components = useComponentsStore((state) => state.components); // Retrieve components from the store

    useEffect(() => {
        if (open && component) {
            setFormData(component);
            setErrors({});
        }
    }, [open, component]);

    useEffect(() => {
        const suppliers = [...new Set(components.map((comp) => comp.supplier))]; // Get unique supplier names
        setUniqueSuppliers(['None', ...suppliers.filter(Boolean)]); // Add "None" as a hardcoded option and remove null/empty
    }, [components]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
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
                newErrors[field] = 'Required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!formData) return;

        if (!validateFields()) {
            return;
        }

        const result = await updateComponent(formData.id, formData);
        if (result) {
            updateComponentInStore(result);
            onClose();
        } else {
            alert('Failed to update component. Please try again.');
        }
    };

    const isComponentLinked = (componentId) => {
        const products = useProductsStore.getState().products; // Get products from the store
        return products.some((product) =>
            product.productComponentList.some((productComponent) => productComponent.componentId === componentId)
        );
    };

    const handleDelete = async () => {
        if (isComponentLinked(component.id)) {
            alert('This component is linked to a product and cannot be deleted.');
            return;
        }

        const confirm = window.confirm(`Are you sure you want to delete this component?`);
        if (!confirm) return;

        const result = await deleteComponent(component.id);
        if (result) {
            deleteComponentInStore(component.id);
            onClose();
        } else {
            alert('Failed to delete the component. Please try again.');
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
                    {`${component.name} (${component.manufacturerPart})`}
                </Typography>
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
                        mb: 3,
                        p: 1,
                    }}
                >
                    <Grid container alignItems="center" justifyContent="center" spacing={2}>
                        <>
                        {formData &&
                            Object.keys(formData)
                                .filter(
                                    (field) =>
                                        ![
                                            'id',
                                            'userId',
                                            'supplierStock',
                                            'supplierIncomingStock',
                                            'supplierIncomingDate',
                                            'supplierStockStatus',
                                            'stockStatus',
                                        ].includes(field)
                            ) // Exclude non-editable fields
                            .map((field) => (
                                field === 'supplier' ? (
                                    <Grid xs={12} lg={3} key={field}>
                                        <FormControl
                                            fullWidth
                                            sx={{ minWidth: 195 }}
                                        >
                                            <InputLabel>Supplier</InputLabel>
                                            <Select
                                                name={field}
                                                value={formData[field] || ''}
                                                onChange={(e) => handleChange(e)}
                                                label="Supplier"
                                                fullWidth
                                            >
                                                {uniqueSuppliers.map((supplier) => (
                                                    <MenuItem key={supplier} value={supplier}>
                                                        {supplier}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                ) : (
                                <Grid xs={12} lg={3} key={field}>
                                    <TextField
                                        label={field}
                                        name={field}
                                        variant="outlined"
                                        fullWidth
                                        value={formData[field] || ''}
                                        onChange={handleChange}
                                        type={
                                            ['price', 'stock', 'safetyStock', 'safetyStockRop', 'supplierSafetyStock', 'supplierSafetyStockRop'].includes(field)
                                                ? 'number'
                                                : 'text'
                                        }
                                        error={!!errors[field]}
                                        helperText={errors[field] || ''}
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
                <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={handleDelete}
                >
                    Delete Component
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsEditModal;