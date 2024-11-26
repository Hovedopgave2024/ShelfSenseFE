import { getRequest } from './GetRequestService.jsx';
import { CheckCircleOutlined, WarningOutlined, ErrorOutlined } from '@mui/icons-material';

export const fetchComponents = async () => {
    return await getRequest(`products`);
};

export const createProduct = async (productData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(productData),
        });

        if (response.status === 401) {
            console.error('Unauthorized request while creating product.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create product:', response.status);
            return null;
        }

        const data = await response.json();
        console.log('Created product:', data); // Log the response entity
        return data;

    } catch (error) {
        console.error('Error occurred while creating product:', error);
        return null;
    }
};

export const createProductComponents = async (productComponentsData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/productComponents`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(productComponentsData),
        });

        if (response.status === 401) {
            console.error('Unauthorized request while creating product components.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create product components:', response.status);
            return null;
        }

        const data = await response.json();
        console.log('Created product components:', data);
        return data;
    } catch (error) {
        console.error('Error occurred while creating product components:', error);
        return null;
    }
};

export const chipConfig = (stock, safetyStock, safetyMultiplier) => {
    const stockPercentage = (stock / safetyStock) * 100 - 100;
    const extraStock = stock - safetyStock;

    if (stock >= safetyStock * safetyMultiplier) {
        return {
            color: 'success',
            label: 'In stock',
            icon: <CheckCircleOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    } else if (stock >= safetyStock) {
        return {
            color: 'warning',
            label: 'Low on stock',
            icon: <WarningOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    } else {
        return {
            color: 'error',
            label: 'Under safety stock',
            icon: <ErrorOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    }
};



