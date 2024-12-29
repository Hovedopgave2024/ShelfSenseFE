import {useEffect, useState} from "react";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import dayjs from "dayjs";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx";
import {updateSalesOrder} from "../../services/salesOrder/updateSalesOrder.js";
import Autocomplete from "@mui/material/Autocomplete";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {deleteSalesOrder} from "../../services/salesOrder/deleteSalesOrder.js";


const SaleOrdersEditModal = ({ open, onClose, salesOrder}) => {
    const [formData, setFormData] = useState({
        productId: salesOrder.productId || '',
        productName: salesOrder.productName || '',
        quantity: salesOrder.quantity || '',
        price: salesOrder.price || '',
        createdDate: salesOrder.createdDate || '',
    });
    const [errors, setErrors] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const updateSalesOrderInStore = useSalesOrdersStore((state) => state.updateSalesOrder);
    const deleteSalesOrderInStore = useSalesOrdersStore(state => state.deleteSalesOrder);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const products = useProductsStore((state) => state.products);

    const handleCloseDialog = () => setDialogOpen(false);

    useEffect(() => {
        if (open && salesOrder) {
            setFormData(salesOrder);
            setErrors({});
        }
    }, [open, salesOrder]);

    const requiredFields = [
        "productId",
        'quantity',
        'price',
        'createdDate',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const handleDateChange = (newValue) => {
        const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
        setFormData((prevData) => ({
            ...prevData,
            createdDate: formattedDate,
        }));
        if (errors.createdDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                createdDate: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `Required`;
            }

            if (['quantity', 'price', 'productId'].includes(field)) {
                if (isNaN(formData[field]) || formData[field] <= 0) {
                    newErrors[field] = 'Must be a valid positive number';
                }
            }

            if (field === 'createdDate') {
                const selectedDate = dayjs(formData.createdDate);
                const today = dayjs();
                if (!selectedDate.isValid()) {
                    newErrors[field] = 'Invalid date. Ensure it is a valid date.';
                } else if (selectedDate.isAfter(today)) {
                    newErrors[field] = 'Order date cannot be in the future.';
                }
            }
        });

        setErrors(newErrors);
        showSnackbar('warning', 'Please fill out all fields correctly and try again');
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!formData) return;

        if (!validateForm()) return;

        const result = await updateSalesOrder(formData);

        if (!result) {
            showSnackbar('error', 'Error: Sales order was not updated, maybe the product linked to the sales order was deleted? Please try again or contact Support');
            return;
        }

        const updatedStoreOrder = {
            id: result.id,
            productId: result.productId,
            productName: result.productName,
            quantity: result.quantity,
            price: result.price,
            createdDate: result.createdDate,
        };

        updateSalesOrderInStore(updatedStoreOrder);
        showSnackbar('success', 'Sales order updated successfully');
        onClose();
    };

    const handleDeleteSalesOrder = async () => {
        setDialogOpen(true);
    }

    const confirmDeleteSalesOrder = async () => {
        setDialogOpen(false);
        const deleteProductResult = await deleteSalesOrder(salesOrder.id);
        if (!deleteProductResult) {
            showSnackbar('error', 'Error: Sales order was not deleted. Please try again or contact Support');
            return;
        }
        deleteSalesOrderInStore(salesOrder.id)
        showSnackbar('success', 'Sales order deleted successfully.');
        onClose();
    }

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
                    Update Sales Order
                </Typography>
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
                        mb: 3,
                        p: 1,
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            pb: 3,
                        }}>
                        <Grid xs={12} lg={3}>
                            <TextField
                                disabled
                                name='product'
                                value={salesOrder.productName}
                            />
                        </Grid>
                        <Grid xs={12} lg={3} >
                            <TextField
                                disabled
                                label={requiredFields.includes('quantity')
                                    ? `quantity *`
                                    : 'quantity'}
                                name='quantity'
                                variant="outlined"
                                sx={{ width: 195 }}
                                value={formData.quantity}
                                onChange={handleChange}
                                error={!!errors.quantity}
                                helperText={errors.quantity || ''}
                                type='number'
                            />
                        </Grid>
                        <Grid xs={12} lg={3}>
                            <TextField
                                label={requiredFields.includes('price')
                                    ? `price *`
                                    : 'price'}
                                name='price'
                                variant="outlined"
                                sx={{ width: 195 }}
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors['price']}
                                helperText={errors['price'] || ''}
                                type='number'
                            />
                        </Grid>
                        <Grid xs={12} lg={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="da">
                                <DatePicker
                                    sx={{ width: 195 }}
                                    label="Order Date"
                                    value={dayjs(formData.createdDate)}
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            variant: 'outlined',
                                            error: !!errors.createdDate,
                                            helperText: errors.createdDate || '',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
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
                        Update Sales Order
                    </Button>
                    <Button
                        color="error"
                        onClick={handleDeleteSalesOrder}
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
                    onAccept={confirmDeleteSalesOrder}
                    onDecline={handleCloseDialog}
                    acceptText="Delete"
                    declineText="Cancel"
                />
            </Box>
        </Modal>
    )
}

export default SaleOrdersEditModal;