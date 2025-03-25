const validateFields = (formData, requiredFields = [], positiveNumberFields = []) => {
    const errors = {};

    // Required fields check
    requiredFields.forEach(field => {
        const value = formData[field];
        if (value === null || value === undefined || value === '') {
            errors[field] = 'Required';
        }
    });

    // Positive number check
    positiveNumberFields.forEach(field => {
        const value = Number(formData[field]);
        if (!isNaN(value) && value <= 0) {
            errors[field] = 'Must be greater than 0';
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export default validateFields;