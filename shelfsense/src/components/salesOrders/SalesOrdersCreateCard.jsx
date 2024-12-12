import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid2';
import {TextField, Card, CardContent, CardHeader, Button} from "@mui/material";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

const SalesOrdersCreateCard = () => {
    // Initial empty form data for creating a component
    const initialFormData = {
        productId: '',
        quantity: '',
        price: '',
    };

    const requiredFields = [
        'productId',
        'quantity',
        'price',
    ]; // Fields that cannot be empty

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    // const addSalesOrder = useSalesOrdersStore((state) => state.addSalesOrder());
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    // Handle changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear the error when the user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `Required`; // Error message for empty fields
            }
        });
        setErrors(newErrors);
        showSnackbar('warning', 'Please fill out all required fields and try again');
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        console.log("triggered handle submit")

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
            width: '100%',
            pt: 2,
            px: 2,
            borderRadius: 5,
            my: { lg: 7, md: 3 },
            margin: "0 auto",
        }}>
            <CardHeader
                title="Create a New Sales Order"
                sx={{ textAlign: 'center' }}
            />
            <CardContent>
                    <Grid container alignItems="center" spacing={2} sx={{pb: 3, justifyContent: 'center',}}>
                        <>
                            {Object.keys(formData).map((field) => (
                                <Grid xs={12} lg={3} key={field}>
                                    <TextField
                                        label={requiredFields.includes(field)
                                            ? `${field} *`
                                            : field}
                                        name={field}
                                        variant="outlined"
                                        sx={{ width: 195 }}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        error={!!errors[field]} // Adds red border if there’s an error
                                        helperText={errors[field] || ''} // Displays error message below the field
                                        type={
                                            ['productId', 'quantity', 'price'].includes(field)
                                                ? 'number'
                                                : 'text'
                                        }
                                    />
                                </Grid>
                            ))}
                        </>
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