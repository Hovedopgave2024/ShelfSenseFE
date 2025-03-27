import {useEffect, useState} from 'react';
import { Box, TextField} from '@mui/material/';
import Grid from '@mui/material/Grid2';
import validateFields from "../../util/misc/validateFields.js";
import {Button, Collapse, FormControl, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import useComponentsStore from "../../stores/useComponentsStore.js";

const SupplierFieldsCard = ({ data, onValidation }) => {

    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({})
    const components = useComponentsStore((state) => state.components);
    const [uniqueSuppliers, setUniqueSuppliers] = useState([]);
    const [showFields, setShowFields] = useState(false);

    const requiredFields = ['name', 'stock', 'manufacturer', 'manufacturerPart', 'safetyStock', 'safetyStockRop'];
    const positiveNumberFields = ['stock', 'safetyStock', 'safetyStockRop'];

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
        if ('supplier' in formData) {
            const suppliers = [...new Set(components.map((comp) => comp.supplier?.name))];
            setUniqueSuppliers(['None', ...suppliers.filter(Boolean)]);
        }
    }, [components, formData]);

    useEffect(() => {
        if (onValidation) {
            if (!showFields) {
                // Supplier section is collapsed, treat as not provided
                onValidation({
                    isValid: true,
                    data: null,
                    errors: {},
                });
                return;
            }

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
            {!showFields ? (
                <Box textAlign="center">
                    <Typography variant="body1">
                        Add Supplier Details
                    </Typography>
                    <Button variant="outlined" onClick={() => setShowFields(true)}>
                        Add Fields
                    </Button>
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={2}>
                        <Typography variant="h6">Supplier Fields</Typography>
                        <Button variant="outlined" onClick={() => setShowFields(false)}>
                            Collapse
                        </Button>
                    </Box>
                    <Collapse in={showFields}>
                        <Grid container alignItems="center" justifyContent="center" spacing={2}>
                            {Object.keys(formData).map((field) =>
                                field === 'supplier' ? (
                                    <Grid xs={12} lg={3} key={field}>
                                        <FormControl sx={{ width: 195 }} error={!!errors[field]}>
                                            <Autocomplete
                                                freeSolo
                                                options={uniqueSuppliers}
                                                value={formData.supplier || ''}
                                                onChange={(e, newValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        supplier: newValue || '',
                                                    }));
                                                    if (errors.supplier) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            supplier: null,
                                                        }));
                                                    }
                                                }}
                                                onInputChange={(e, newInputValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        supplier: newInputValue || '',
                                                    }));
                                                    if (errors.supplier) {
                                                        setErrors((prevErrors) => ({
                                                            ...prevErrors,
                                                            supplier: null,
                                                        }));
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Supplier"
                                                        name="supplier"
                                                        variant="outlined"
                                                        error={!!errors.supplier}
                                                        helperText={errors.supplier || ''}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                ) : (
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
                                )
                            )}
                        </Grid>
                    </Collapse>
                </>
            )}
        </Box>
    );
};

export default SupplierFieldsCard;