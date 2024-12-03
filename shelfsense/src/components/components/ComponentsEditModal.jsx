import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material/';
import Grid from '@mui/material/Grid2';
import useComponentsStore from "../../stores/useComponentsStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import {updateComponent, deleteComponent} from "../../util/services/ComponentService.jsx";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ComponentsEditModal = ({ open, onClose, component}) => {
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [uniqueSuppliers, setUniqueSuppliers] = useState([]); // Store unique suppliers
    const [dialogOpen, setDialogOpen] = useState(false);

    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);
    const deleteComponentInStore = useComponentsStore((state) => state.deleteComponent);
    const components = useComponentsStore((state) => state.components); // Retrieve components from the store
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    const handleCloseDialog = () => setDialogOpen(false);

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
        showSnackbar('warning', 'Please fill out all required fields and try again.');
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!formData) return;

        if (!validateFields()) {
            return;
        }

        const result = await updateComponent(formData.id, formData);

        if (!result) {
            showSnackbar('error', 'Error: Component was not updated. Please try again or contact Support.');
            return;
        }
        updateComponentInStore(result);
        showSnackbar('success', 'Component updated successfully');
        onClose();
    };

    const isComponentLinked = (componentId) => {
        const products = useProductsStore.getState().products; // Get products from the store
        return products.some((product) =>
            product.productComponentList.some((productComponent) => productComponent.componentId === componentId)
        );
    };

    const handleDeleteComponent = async () => {
        if (isComponentLinked(component.id)) {
            showSnackbar('error', 'Error: This component is linked to a product and cannot be deleted.');
            return;
        }
        setDialogOpen(true);
    };

    const confirmDeleteComponent = async () => {
        setDialogOpen(false);
        const result = await deleteComponent(component.id);
        if (!result){
            showSnackbar('error', 'Error: Failed to delete the component. Please try again or contact Support.');
            return;
        }
        deleteComponentInStore(component.id);
        showSnackbar('success', 'Component deleted successfully.');
        onClose();
    };


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
                                            sx={{ width: 195 }}
                                        >
                                            <InputLabel>Supplier</InputLabel>
                                            <Select
                                                variant="outlined"
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
                                        sx={{ width: 195 }}
                                        name={field}
                                        variant="outlined"
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        mt: 'auto',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ flexGrow: 1, mr: 2 }}
                        onClick={handleSubmit}
                    >
                        Update Component
                    </Button>
                    <Button
                        color="error"
                        onClick={handleDeleteComponent}
                        sx={{
                            minWidth: 'auto',
                            p: 1,
                        }}
                    >
                        <DeleteOutlineIcon />
                    </Button>
                </Box>
                <ConfirmDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    headline="Confirm Deletion"
                    text="Are you sure you want to delete this component? This action cannot be undone."
                    onAccept={confirmDeleteComponent}
                    onDecline={handleCloseDialog}
                    acceptText="Delete"
                    declineText="Cancel"
                />
            </Box>
        </Modal>
    );
};

export default ComponentsEditModal;