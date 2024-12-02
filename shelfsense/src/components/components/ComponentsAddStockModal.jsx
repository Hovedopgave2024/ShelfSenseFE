import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import useComponentsStore from "../../stores/useComponentsStore";
import { updateComponent } from "../../util/services/ComponentService";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

const ComponentsAddStockModal = ({ open, onClose, component }) => {
    const [addStockValue, setAddStockValue] = useState("");
    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    useEffect(() => {
        if (component) {
            setAddStockValue("");
        }
    }, [component]);

    const handleUpdateStock = async () => {
        if (!component) return;

        const updatedComponent = {
            ...component,
            stock: component.stock + addStockValue,
        };

        const result = await updateComponent(component.id, updatedComponent);
        if (!result)
        {
            showSnackbar('error', 'Failed to update stock. Please try again.');
            return;
        }

        updateComponentInStore(result);
        showSnackbar('success', 'Stock updated successfully');
        onClose();
    };

    const handleAddStockChange = (e) => {
        const value = e.target.value;
        setAddStockValue(value === "" ? "" : parseInt(value) || "");
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
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h6">
                    {`${component.name} (${component.manufacturerPart})`}
                </Typography>
                <TextField
                    label="Stock to Add"
                    type="number"
                    fullWidth
                    value={addStockValue}
                    onChange={handleAddStockChange}
                />
                <Button variant="contained" color="primary" onClick={handleUpdateStock}>
                    Update Stock
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsAddStockModal;
