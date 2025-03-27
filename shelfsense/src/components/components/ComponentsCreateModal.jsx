import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button } from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';

import useComponentsStore from "../../stores/useComponentsStore.js";
import {createComponent} from "../../services/component/createComponent.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import ComponentFieldsCard from "./ComponentFieldsCard.jsx";
import SupplierFieldsCard from "./SupplierFieldsCard.jsx";
import OptionalComponentFieldsCard from "./OptionalComponentFieldsCard.jsx";

const ComponentsCreateModal = ({ open, onClose }) => {

    const initialComponentFormData = {
        name: '',
        price: '',
        stock: '',
        safetyStock: '',
        safetyStockRop: '',
    };

    const initialSupplierFormData = {
        name: '',
        manufacturer: '',
        manufacturerPart: '',
        stock: '',
        safetyStock: '',
        safetyStockRop: '',
        supplierPart: '',
    };

    const initialOCFFormData = [
        {
            name: '',
            value: '',
        }
    ];

    const [componentFormData, setComponentFormData] = useState(initialComponentFormData);
    const [supplierFormData, setSupplierFormData] = useState(initialSupplierFormData);
    const [OCFFormData, setOCFFormData] = useState(initialOCFFormData);
    const addComponent = useComponentsStore((state) => state.addComponent);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [onComponentValidation, setOnComponentValidation] = useState(null);
    const [onSupplierValidation, setOnSupplierValidation] = useState(null);
    const [onOCFValidation, setOnOCFValidation] = useState(null);



    // Handle form submission
    const handleSubmit = async () => {
        const [componentResult, supplierResult, ocfResult] = await Promise.all([
            new Promise(resolve => setOnComponentValidation(() => resolve)),
            new Promise(resolve => setOnSupplierValidation(() => resolve)),
            new Promise(resolve => setOnOCFValidation(() => resolve)),
        ]);

        if (!componentResult.isValid || !supplierResult.isValid || !ocfResult.isValid) {
            console.log({
                componentErrors: componentResult.errors,
                supplierErrors: supplierResult.errors,
                ocfErrors: ocfResult.errors,
            });
            return;
        }

        const mergedData = {
            ...componentResult.data,
            supplier: supplierResult.data,
            optionalComponentFields: ocfResult.data,
        };

        const created = await createComponent(mergedData);

        if (!created) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }

        addComponent(created);
        showSnackbar('success', 'Component created successfully');
        onClose();
        setComponentFormData(initialComponentFormData);
        setSupplierFormData(initialSupplierFormData);
        setOCFFormData(initialOCFFormData);
    };

    // Reset form data and errors when the modal opens
    useEffect(() => {
        if (open) {
            setComponentFormData(initialComponentFormData);
            setSupplierFormData(initialSupplierFormData);
            setOCFFormData(initialOCFFormData);
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
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
                        mb: 3,
                    }}
                >
                    <ComponentFieldsCard
                        data={componentFormData}
                        onValidation={onComponentValidation}
                    />
                    <SupplierFieldsCard
                        data={supplierFormData}
                        onValidation={onSupplierValidation}
                    />
                    <OptionalComponentFieldsCard
                        data={OCFFormData}
                        onValidation={onOCFValidation}
                        />
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

export default ComponentsCreateModal;