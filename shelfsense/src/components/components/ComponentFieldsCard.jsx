import {useEffect, useState} from 'react';
import { Box, TextField} from '@mui/material/';
import Grid from '@mui/material/Grid2';
import validateFields from "../../util/misc/validateFields.js";
import {Typography} from "@mui/material";

const ComponentFieldsCard = ({ data, onValidation  }) => {

    const EmptyFormData = {
        name: '',
        price: 0,
        stock: 0,
        safetyStock: 0,
        safetyStockRop: 0
    };

    const requiredFields = ['name', 'price', 'stock', 'safetyStock', 'safetyStockRop'];
    const positiveNumberFields = ['price', 'stock', 'safetyStock', 'safetyStockRop'];

    const [formData, setFormData] = useState(data || EmptyFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const { isValid, errors } = validateFields(formData, requiredFields, positiveNumberFields);
        setErrors(errors);
        return isValid;
    };

    if (onValidation) {
        validateForm(onValidation);
    }

    useEffect(() => {
            setFormData(data || EmptyFormData);
            setErrors({});
    }, []);

    return (
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '60vh',
                        mb: 3,
                    }}
                >
                    <Typography variant="h6" component="h2" mb={2}>
                        Required Component Fields
                    </Typography>
                    <Grid container alignItems="center" justifyContent="center" spacing={2}>
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
                                                ['price', 'stock', 'safetyStock', 'safetyStockRop', 'supplierSafetyStock', 'supplierSafetyStockRop'].includes(field)
                                                    ? 'number'
                                                    : 'text'
                                            }
                                        />
                                    </Grid>
                            ))}
                        </>
                    </Grid>
                </Box>
    );
};

export default ComponentFieldsCard;