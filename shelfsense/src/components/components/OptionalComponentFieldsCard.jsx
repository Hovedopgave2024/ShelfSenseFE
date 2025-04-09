import {useEffect, useState} from 'react';
import { Box, TextField} from '@mui/material/';
import Grid from '@mui/material/Grid2';
import {Button, Collapse, IconButton, Typography} from "@mui/material";
import {Add, Remove} from "@mui/icons-material";

const OptionalComponentFieldsCard = ({ data, onValidation }) => {

    const [selectedComponents, setSelectedComponents] = useState(data);
    const [errors, setErrors] = useState([]);
    const [showFields, setShowFields] = useState(false);

    const handleComponentChange = (index, field, value) => {
        const updated = [...selectedComponents];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setSelectedComponents(updated);

        if (errors[index]?.[field]) {
            const updatedErrors = [...errors];
            updatedErrors[index] = {
                ...updatedErrors[index],
                [field]: null,
            };
            setErrors(updatedErrors);
        }
    };


    const handleAddComponent = () => {
        setSelectedComponents(prev => [...prev, { name: '', value: '' }]);
    };

    const handleRemoveComponent = (index) => {
        const updated = [...selectedComponents];
        updated.splice(index, 1);
        setSelectedComponents(updated);
    };

    const validateOptionalFields = () => {
        let valid = true;
        const newErrors = [];

        selectedComponents.forEach((item, i) => {
            const itemErrors = {};
            if (!item.name?.trim()) {
                itemErrors.name = 'Name is required';
                valid = false;
            }
            if (!item.value?.trim()) {
                itemErrors.value = 'Value is required';
                valid = false;
            }
            newErrors[i] = itemErrors;
        });

        return { isValid: valid, errors: newErrors };
    };

    useEffect(() => {
        setSelectedComponents(data);
        setErrors({});

        const hasAnyValue = data.some(obj =>
            Object.values(obj).some(value => value !== '' && value != null)
        );

        if (hasAnyValue) {
            setShowFields(true);
        }

    },[data]);

    useEffect(() => {
        if (onValidation) {
            if (!showFields || selectedComponents.length === 0) {
                onValidation({
                    isValid: true,
                    data: null,
                    errors: [],
                });
                return;
            }

            const { isValid, errors } = validateOptionalFields();
            setErrors(errors);
            onValidation({
                isValid,
                data: selectedComponents,
                errors,
            });
        }
    }, [onValidation]);

    return (
        <Box sx={{ mb: 3 }}>
            {!showFields ? (
                <Box textAlign="center">
                    <Typography variant="body1" mb={1}>Add Optional Fields</Typography>
                    <Button variant="outlined" onClick={() => setShowFields(true)}>Add Fields</Button>
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={2}>
                        <Typography variant="h6">Optional Component Fields</Typography>
                        <Button variant="outlined" onClick={() => setShowFields(false)}>
                            <Typography variant="body2" align="center">
                                Collapse<br />
                                <Typography variant="caption" component="span">(Data Not Saved)</Typography>
                            </Typography>
                        </Button>
                    </Box>
                    <Collapse in={showFields}>
                        <Grid container spacing={2}>
                            {selectedComponents.map((item, index) => (
                                <Grid container item xs={12} spacing={1} key={index} alignItems="center">
                                    <Grid item xs={5}>
                                        <TextField
                                            label="Name *"
                                            name="name"
                                            value={item.name}
                                            onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                                            error={!!errors[index]?.name}
                                            helperText={errors[index]?.name}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            label="Value *"
                                            name="value"
                                            value={item.value}
                                            onChange={(e) => handleComponentChange(index, 'value', e.target.value)}
                                            error={!!errors[index]?.value}
                                            helperText={errors[index]?.value}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="error" onClick={() => handleRemoveComponent(index)}>
                                            <Remove />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid item xs={12} mt={3}>
                            <Button variant="outlined" startIcon={<Add />} onClick={handleAddComponent}>
                                Add Field
                            </Button>
                        </Grid>
                    </Collapse>
                </>
            )}
        </Box>
    );
};

export default OptionalComponentFieldsCard;