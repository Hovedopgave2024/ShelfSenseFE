import { getRequest } from './getRequestService.jsx';
import {CheckCircleOutlined, ErrorOutlined, WarningOutlined} from "@mui/icons-material";

export const fetchComponents = async () => {
    return await getRequest(`components`);
};

export const createComponent = async (componentData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(componentData),
        });

        if (response.status === 401) {
            console.error('Unauthorized request while creating component.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create component:', response.status);
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
};

export const stockCalculator = (stock, safetyStock, safetyStockROP) => {
    const stockPercentage = (stock / safetyStock) * 100 - 100;
    const extraStock = stock - safetyStock;
    const criticalROP = safetyStockROP * 0.75;

    if (stock > safetyStockROP) {
        // Stock is above the reorder point (safe condition)
        return {
            color: 'success',
            label: 'In stock',
            icon: <CheckCircleOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    } else if (stock <= safetyStock) {
        // Stock is at or below the safety stock level
        return {
            color: 'error',
            label: 'Critical Stock Level',
            icon: <ErrorOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    } else if (stock > criticalROP) {
        // Stock is below reorder point but above critical ROP
        return {
            color: 'warning',
            label: 'Low on stock',
            icon: <WarningOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    } else {
        // Stock is below critical ROP
        return {
            color: 'low',
            label: 'Close to stock out',
            icon: <ErrorOutlined fontSize="small" />,
            percentage: stockPercentage,
            extraStock,
        };
    }
};


