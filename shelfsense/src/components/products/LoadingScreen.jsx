import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    CircularProgress,
    useTheme,
} from "@mui/material";
import Divider from "@mui/material/Divider";

const LoadingScreen = ({
                           open,
                       }) => {
    const theme = useTheme(); // Access the current theme

    return (
        <Dialog
            open={open}
            aria-labelledby="dialog-title"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: "10px 15px 25px rgba(0, 0, 0, 0.3)",
                },
            }}
        >
            <Box sx={{ backgroundColor: theme.palette.background.paper, padding: 1 }}>
                <DialogTitle id="dialog-title">
                    <Typography variant="h5" component="div">
                        Retrieving API Data
                    </Typography>
                </DialogTitle>
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.divider }} />
            <DialogContent
                sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Spinner */}
                <CircularProgress
                    size={80}
                    thickness={5}
                    sx={{
                        color: theme.palette.primary.main,
                        marginBottom: 2,
                    }}
                />

                {/* Loading Text */}
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ marginBottom: 1 }}
                >
                    Hold tight! We are updating supplier details for your Mouser components as we fetch the latest API information.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default LoadingScreen;