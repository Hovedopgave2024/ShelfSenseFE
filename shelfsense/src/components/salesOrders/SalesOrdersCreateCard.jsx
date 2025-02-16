import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import {TextField, Card, CardContent, CardHeader, Button, Typography, FormControl, IconButton} from "@mui/material";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/da.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProductsStore from "../../stores/useProductsStore.js";
import Autocomplete from "@mui/material/Autocomplete";
import {createSalesOrder} from "../../services/salesOrder/createSalesOrder.js";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import useComponentsStore from "../../stores/useComponentsStore.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";
import {Add, Remove} from "@mui/icons-material";


const SalesOrdersCreateCard = () => {
    const initialFormData = {
        price: '',
        createdDate: dayjs().format('YYYY-MM-DD'),
    };

    const requiredFields = [
        'price',
        'createdDate',
    ];

    const [formData, setFormData] = useState(initialFormData);
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

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `Required`;
            }

            if (['price'].includes(field)) {
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

        selectedProducts.forEach((product, index) => {
            if (!product.productId) {
                newErrors[`productId_${index}`] = "Product is required.";
            }
            if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
                newErrors[`quantity_${index}`] = "Valid quantity is required.";
            }
        });

        setErrors(newErrors);
        showSnackbar('warning', 'Please fill out all fields correctly and try again');
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

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

        const updatedComponents = new Map();
        result.salesOrderProducts?.forEach((sop) => {

            const selectedProduct = products.find((p) => p.id === sop.productId);

            if (selectedProduct && selectedProduct.productComponentList.length !== 0) {
                selectedProduct.productComponentList.forEach((pc) => {

                    const componentId = pc.componentId;

                    let currentStock = updatedComponents.has(componentId)
                        ? updatedComponents.get(componentId)
                        : components.find((component) => component.id === pc.componentId).stock;

                    const requiredQuantity = parseInt(pc.quantity) * parseInt(sop.quantity);
                    updatedComponents.set(componentId, currentStock - requiredQuantity);
                });
            }
        });

        updatedComponents.forEach((newStock, componentId) => {
            const component = useComponentsStore.getState().components.find(comp => comp.id === componentId);

            if (!component) {
                console.warn(`Component not found in Zustand state: ${componentId}`);
                return;
            }

            updateComponent({
                ...component,
                stock: Number(newStock),
                stockStatus: calculateStatus(Number(newStock), Number(component.safetyStock), Number(component.safetyStockRop)),
            });
        });

        showSnackbar('success', 'Sales order created successfully');
        setFormData(initialFormData);
        setErrors({});
    };

    // Reset form data and errors when the modal opens
    useEffect(() => {
        setFormData(initialFormData);
        setErrors({});
    }, []);

    return (
        <Card
            sx={{
                maxWidth: { lg: 400, md: '100%' },
                width: '100%',
                pt: 2,
                px: 2,
                borderRadius: 5,
                mt: { lg: 9, md: 5 },
                mb: 2,
            }}
        >
            <CardHeader title="Create a New Sales Order" sx={{ textAlign: 'center' }} />
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ pb: 3 }}
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                        overflowY: 'auto',
                        maxHeight: '46vh',
                        mb: 1
                    }}
                    >
                    {/* Price Input */}
                    <Grid item sx={{width: "100%"}}>
                        <TextField
                            label={requiredFields.includes('price') ? `Price *` : 'Price'}
                            name="price"
                            variant="outlined"
                            fullWidth
                            value={formData.price}
                            onChange={handleChange}
                            error={!!errors['price']}
                            helperText={errors['price'] || ''}
                            type="number"
                        />
                    </Grid>

                    {/* Date Picker */}
                    <Grid item sx={{width: "100%"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="da">
                            <DatePicker
                                label="Order Date"
                                value={dayjs(formData.createdDate)}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        variant: 'outlined',
                                        error: !!errors.createdDate,
                                        helperText: errors.createdDate || '',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Selected Products Section */}
                    <Grid item xs={12} sx={{width: "100%", textAlign: 'center'}}>
                        <Typography variant="subtitle1">Add Products</Typography>
                    </Grid>

                    {selectedProducts.map((product, index) => (
                        <Grid
                            container
                            key={index}
                            direction="row"
                        >
                            {/* Product Selection */}
                            <Grid item sx={{ width: '100%' }}>
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
                                            handleProductChange(index, 'productId', newValue ? newValue.id : '')
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

                            <Grid item sx={{ width: '100%' }}>
                                {/* Quantity Input */}
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    variant="outlined"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        handleProductChange(index, 'quantity', e.target.value)
                                    }
                                    error={!!errors[`quantity_${index}`]}
                                    helperText={errors[`quantity_${index}`]}
                                />
                                {/* Remove Button */}
                                <IconButton color="error" onClick={() => handleRemoveProduct(index)} sx={{pt: 2}} >
                                    <Remove />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>

                    {/* Add Product Button */}
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddProduct}
                            sx={{ mt: 1, px: 4 }}
                        >
                            Add Product
                        </Button>
                    </Grid>

                    {/* Save Order Button */}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                            Save Sales Order
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SalesOrdersCreateCard;