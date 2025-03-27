import {useEffect, useState} from 'react';
import { Box, TextField} from '@mui/material/';
import Grid from '@mui/material/Grid2';
import validateFields from "../../util/misc/validateFields.js";
import {Typography} from "@mui/material";

const ComponentFieldsCard = ({ data, onValidation }) => {

    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({})

    const requiredFields = ['name', 'price', 'stock', 'safetyStock', 'safetyStockRop'];
    const positiveNumberFields = ['price', 'stock', 'incomingStock', 'safetyStock', 'safetyStockRop'];

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

    useEffect(() => {
            setFormData(data);
            setErrors({});
    },[data]);

    useEffect(() => {
        if (onValidation) {
            const { isValid, errors } = validateFields(formData, requiredFields, positiveNumberFields);
            setErrors(errors);

            onValidation({
                isValid,
                data: formData,
                errors,
            });
        }
    }, [onValidation]);

    return (
        <Box
            sx={{
                mb: 3,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Required Component Fields</Typography>
            </Box>
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
                {Object.keys(formData).map((field) =>
                    <Grid xs={12} lg={3} key={field}>
                        <TextField
                            label={
                                requiredFields.includes(field)
                                    ? `${field} *`
                                    : field
                            }
                            name={field}
                            variant="outlined"
                            sx={{ width: 195 }}
                            value={formData[field] ?? ''}
                            onChange={handleChange}
                            error={!!errors[field]}
                            helperText={errors[field] || ''}
                            type={
                                positiveNumberFields.includes(field)
                                    ? 'number'
                                    : 'text'
                            }
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ComponentFieldsCard;