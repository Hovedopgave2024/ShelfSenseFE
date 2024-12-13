import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import {TextField, Card, CardContent, CardHeader, Button} from "@mui/material";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useProductsStore from "../../stores/useProductsStore.js";
import Autocomplete from "@mui/material/Autocomplete";

const SalesOrdersCreateCard = () => {
    const initialFormData = {
        productId: '',
        quantity: '',
        price: '',
        orderDate: '2022-04-17',
    };

    const requiredFields = [
        "productId",
        'quantity',
        'price',
        'orderDate',
    ];

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    // const addSalesOrder = useSalesOrdersStore((state) => state.addSalesOrder());
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const products = useProductsStore((state) => state.products);

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
            orderDate: formattedDate,
        }));
        if (errors.orderDate) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                orderDate: null,
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

            if (field === 'orderDate') {
                const selectedDate = dayjs(formData.orderDate);
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

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        console.log("triggered handle submit")

        console.log(formData);

        /* const result = await createComponent(formData); // Send form data to backend to create a component

        if (!result) {
            showSnackbar('error', 'Error: Component was not created. Please try again or contact Support');
            return;
        }
        addComponent(result); */
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
        <Card sx={{
            maxWidth: { lg: 400, md: '100%' },
            maxHeight: { lg: 460, xs: 500},
            width: '100%',
            pt: 2,
            px: 2,
            borderRadius: 5,
            mt: { lg: 9, md: 5 },
            mb: 2,
        }}>
            <CardHeader
                title="Create a New Sales Order"
                sx={{ textAlign: 'center' }}
            />
            <CardContent>
                    <Grid container alignItems="center" spacing={2} sx={{pb: 3, justifyContent: 'center'}}>
                        <Grid xs={12} lg={3} >
                            <Autocomplete sx={{ width: 195 }}
                                options={products}
                                getOptionLabel={(option) => option.name || ''}
                                value={products.find((prod) => prod.id === formData.productId) || null}
                                onChange={(e, newValue) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        productId: newValue?.id || '',
                                    }));
                                    if (errors.productId) {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            productId: null,
                                        }));
                                    }
                                }}
                                onInputChange={(e, newInputValue) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        productId: newInputValue || '',
                                    }));
                                    if (errors.productId) {
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            productId: null,
                                        }));
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Product ID"
                                        name="productId"
                                        variant="outlined"
                                        error={!!errors.productId}
                                        helperText={errors.productId || ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} lg={3} >
                            <TextField
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    sx={{ width: 195 }}
                                    label="Order Date"
                                    value={dayjs(formData.orderDate)}
                                    onChange={handleDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={!!errors.orderDate}
                                            helperText={errors.orderDate || ''}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Save Component
                </Button>
            </CardContent>
        </Card>
    );
};

export default SalesOrdersCreateCard;