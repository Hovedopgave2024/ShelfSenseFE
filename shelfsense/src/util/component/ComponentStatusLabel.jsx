import {CheckCircleOutlined, ErrorOutline, RemoveCircleOutline, WarningAmber} from "@mui/icons-material";

export const statusLabel = (status) => {

    if (status === 4) {
        return {
            color: 'success',
            label: 'In stock',
            icon: <CheckCircleOutlined fontSize="small" />,
        };
    } else if (status === 3) {
        return {
            color: 'warning',
            label: 'Low',
            icon: <WarningAmber fontSize="small" />,
        };
    } else if (status === 2) {
        return {
            color: 'error',
            label: 'Warning',
            icon: <ErrorOutline fontSize="small" />,
        };
    } else if (status === 1){
        return {
            color: "#000000",
            label: 'Critical',
            icon: <RemoveCircleOutline fontSize="small" />,
        };
    } else {
        return {
            color: "gray",
            label: "No Data",
            icon: null,
        }
    }
};