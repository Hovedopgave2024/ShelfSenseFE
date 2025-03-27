import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button } from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';

import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../services/component/createComponent.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import ComponentFieldsCard from "./ComponentFieldsCard.jsx";

const ComponentsCreateModalNew = ({ open, onClose }) => {

    const initialFormData = {
        name: '',
        price: '',
        stock: '',
        safetyStock: '',
        safetyStockRop: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const addComponent = useComponentsStore((state) => state.addComponent);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [onValidation, setOnValidation] = useState(null);

    const requiredComponentFields = ['name', 'price', 'stock', 'safetyStock', 'safetyStockRop'];
    const positiveComponentNumberFields = ['price', 'stock', 'safetyStock', 'safetyStockRop'];

    // Handle form submission
    const handleSubmit = async () => {
        const result = await new Promise((resolve) => {
            setOnValidation(() => resolve);
        });

        if (!result.isValid) {
            console.log(result.errors);
            return;
        }

        const resultData = result.data;

        const created = await createComponent(resultData);

        if (!created) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }

        addComponent(created);
        showSnackbar('success', 'Component created successfully');
        onClose();
        setFormData(initialFormData);
    };

    // Reset form data and errors when the modal opens
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
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
                    Create a New Component
                </Typography>
                <ComponentFieldsCard
                    data={formData}
                    onValidation={onValidation}
                    requiredFields={requiredComponentFields}
                    positiveNumberFields={positiveComponentNumberFields}
                />
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

export default ComponentsCreateModalNew;