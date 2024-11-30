import { Snackbar, Alert } from '@mui/material';
import useSnackbarStore from '../../stores/useSnackbarStore.js';

const CustomizedSnackbar = () => {
    const { snackbar, hideSnackbar } = useSnackbarStore();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideSnackbar(); // Close the snackbar for other reasons (e.g., timeout, close button)
    };

    // severity: 'error' (red) | 'info' (light blue) | 'success' (green) | 'warning' (orange)

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={hideSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default CustomizedSnackbar;