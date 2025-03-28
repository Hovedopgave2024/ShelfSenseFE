import {useEffect, useState} from 'react';
import { Modal, Box, Typography, Button } from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';

import useComponentsStore from "../../stores/useComponentsStore.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import ComponentFieldsCard from "./ComponentFieldsCard.jsx";
import SupplierFieldsCard from "./SupplierFieldsCard.jsx";
import OptionalComponentFieldsCard from "./OptionalComponentFieldsCard.jsx";
import {updateComponent} from "../../services/component/updateComponent.js";
import useProductsStore from "../../stores/useProductsStore.js";
import {deleteComponent} from "../../services/component/deleteComponent.js";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx";

const ComponentsEditModal = ({ open, onClose, component }) => {

    // BUGS: 1. STATE FROM OPENING UPDATE COMPONENT MODAL IS NOT WORKING. 2. SUPPLIERSTOCK SHOULD NOT BE SET I FRONTEND. BUG WITH SUPPLIER STOCK STATUS.

    const [dialogOpen, setDialogOpen] = useState(false);
    const updateComponentInStore = useComponentsStore((state) => state.updateComponent);
    const deleteComponentInStore = useComponentsStore((state) => state.deleteComponent);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    const [componentFormData, setComponentFormData] = useState([]);
    const [supplierFormData, setSupplierFormData] = useState([]);
    const [OCFFormData, setOCFFormData] = useState([]);

    const [onComponentValidation, setOnComponentValidation] = useState(null);
    const [onSupplierValidation, setOnSupplierValidation] = useState(null);
    const [onOCFValidation, setOnOCFValidation] = useState(null);

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

        const isSupplierEmpty = !supplierResult?.data || Object.values(supplierResult.data).every(val => !val);

        const isOCFEmpty =
            !ocfResult?.data ||
            (ocfResult.data.length === 1 &&
                !ocfResult.data[0].name &&
                !ocfResult.data[0].value);

        const mergedData = {
            ...componentResult.data,
            supplier: isSupplierEmpty ? null : supplierResult.data,
            optionalComponentFields: isOCFEmpty ? null : ocfResult.data,
        };

        const updated = await updateComponent(component.id, mergedData);

        if (!updated) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }

        updateComponentInStore(updated);

        showSnackbar('success', 'Component created successfully');
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

    const handleCloseDialog = () => setDialogOpen(false);

    useEffect(() => {
        if (open && component) {
            // Populate with existing component data
            setComponentFormData({
                name: component?.name || '',
                price: component?.price || '',
                stock: component?.stock || '',
                safetyStock: component?.safetyStock || '',
                safetyStockRop: component?.safetyStockRop || '',
            });

            setSupplierFormData({
                name: component?.supplier?.name || '',
                manufacturer: component?.supplier?.manufacturer || '',
                manufacturerPart: component?.supplier?.manufacturerPart || '',
                safetyStock: component?.supplier?.safetyStock || '',
                safetyStockRop: component?.supplier?.safetyStockRop || '',
                supplierPart: component?.supplier?.supplierPart || '',
            });

            setOCFFormData(
                component?.optionalComponentFields?.length > 0
                    ? component.optionalComponentFields
                    : [{ name: '', value: '' }]
            );
        } else {
            // Clear form data on modal close
            setComponentFormData({
                name: '',
                price: '',
                stock: '',
                safetyStock: '',
                safetyStockRop: '',
            });

            setSupplierFormData({
                name: '',
                manufacturer: '',
                manufacturerPart: '',
                safetyStock: '',
                safetyStockRop: '',
                supplierPart: '',
            });

            setOCFFormData([{ name: '', value: '' }]);
        }
    }, [open, component]);

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
                    {`${component.name} ${component.supplier?.manufacturerPart ? `(${component.supplier.manufacturerPart})` : ''}`}
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