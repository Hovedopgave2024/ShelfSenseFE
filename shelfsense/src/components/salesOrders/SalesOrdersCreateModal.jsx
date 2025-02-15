import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    FormControl,
    IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Remove } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from '@mui/material/Autocomplete';

import {useState} from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/da.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProductsStore from "../../stores/useProductsStore.js";
import {createSalesOrder} from "../../services/salesOrder/createSalesOrder.js";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import useComponentsStore from "../../stores/useComponentsStore.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

function CreateSalesOrderModal({ open, onClose }) {
    const [formData, setFormData] = useState({
        price: '',
        createdDate: dayjs().format('YYYY-MM-DD'),
    });

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const addSalesOrder = useSalesOrdersStore((state) => state.addSalesOrder);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const products = useProductsStore((state) => state.products);
    const components = useComponentsStore(state => state.components)
    const updateComponent = useComponentsStore(state => state.updateComponent);

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

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value };
        setSelectedProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, { productId: '', quantity: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
    };

    const validateFields = () => {
        let hasError = false;
        const fieldErrors = {};

        if (formData.price == null || formData.price === '' || isNaN(formData.price) || formData.price <= 0)
        {
            fieldErrors.price = 'Valid price is required.';
            hasError = true;
        }

        const selectedDate = dayjs(formData.createdDate);
        const today = dayjs();
        if (!selectedDate.isValid()) {
            fieldErrors.createdDate = 'Invalid date. Ensure it is a valid date.';
        } else if (selectedDate.isAfter(today)) {
            fieldErrors.createdDate = 'Order date cannot be in the future.';
        }

        selectedProducts.forEach((product, index) => {
            if (!product.productId) {
                fieldErrors[`productId_${index}`] = "Product is required.";
                hasError = true;
            }
            if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
                fieldErrors[`quantity_${index}`] = "Valid quantity is required.";
                hasError = true;
            }
        });

        setErrors(fieldErrors);
        return !hasError;
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            showSnackbar("warning", "Please fill out all required fields and try again");
            return;
        }

        const salesOrderData = {
            price: formData.price,
            createdDate: formData.createdDate,
            salesOrderProducts: selectedProducts.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
            })),
        };

        const result = await createSalesOrder(salesOrderData);

        if (!result) {
            showSnackbar("error", "Error: Sales order was not created.");
            return;
        }

        addSalesOrder(result);
        showSnackbar("success", "Sales order created successfully.");
        setFormData({ price: '', createdDate: dayjs().format('YYYY-MM-DD') });
        setSelectedProducts([]);
        setErrors({});
        onClose();
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
                    minWidth: 200,
                    maxWidth: 650,
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
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '50vh',
                        mb: 1
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ ml: 5, mb: 2 }}>
                        Create a New Sales Order
                    </Typography>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        sx={{ ml: 5 }}
                        direction={{ xs: 'column', sm: 'row' }}
                    >
                        {/* Sales order price */}
                        <Grid xs={12} sm={6}>
                            <TextField
                                label="Price"
                                name="price"
                                variant="outlined"
                                fullWidth
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Grid>

                        {/* Sales order date */}
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
                                            helperText: errors.createdDate,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Selected Products Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Add Products</Typography>
                        </Grid>

                        {selectedProducts.map((product, index) => (
                            <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="flex-start"
                                justifyContent="flex-start"
                                direction={{ xs: 'column', sm: 'row' }}
                            >

                                {/* Product Selection */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            options={products.filter(
                                                (p) =>
                                                    !selectedProducts.some(
                                                        (selected) =>
                                                            selected.productId === p.id &&
                                                            selected.productId !== product.productId
                                                    )
                                            )}
                                            getOptionLabel={(option) => option.name}
                                            value={
                                                product.productId
                                                    ? products.find((p) => p.id === product.productId) || null
                                                    : null
                                            }
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            onChange={(e, newValue) =>
                                                handleProductChange(index, "productId", newValue ? newValue.id : "")
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Product"
                                                    variant="outlined"
                                                    error={!!errors[`productId_${index}`]}
                                                    helperText={errors[`productId_${index}`]}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                {/* Quantity Input */}
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={product.quantity}
                                        onChange={(e) =>
                                            handleProductChange(index, "quantity", e.target.value)
                                        }
                                        error={!!errors[`quantity_${index}`]}
                                        helperText={errors[`quantity_${index}`]}
                                    />
                                </Grid>

                                {/* Remove Button */}
                                <Grid item xs={12} sm={2}>
                                    <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                        <Remove />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Add Button */}
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddProduct}
                    sx={{ mt: 1, ml: 5, px: 4 }}
                >
                    Add Product
                </Button>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Save Sales Order
                </Button>
            </Box>
        </Modal>
    );
}

export default CreateSalesOrderModal;
