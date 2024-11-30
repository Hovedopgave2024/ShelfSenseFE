import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, Box,
} from "@mui/material";
import Divider from "@mui/material/Divider";

const ConfirmDialog = ({
                            open,
                            onClose,
                            headline,
                            text,
                            onAccept,
                            onDecline,
                            acceptText = "Accept",
                            declineText = "Decline",
                        }) => {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" PaperProps={{
            sx: {
                borderRadius: 4, // Rounded corners
                boxShadow: "10px 15px 25px rgba(0, 0, 0, 0.8)",
            },
        }}>
            <Box sx={{ backgroundColor: "#e3f2fd", padding: 1 }}>
                <DialogTitle id="dialog-title">
                    <Typography
                        variant="h5"
                    >
                        {headline}
                    </Typography>
                </DialogTitle>
            </Box>
            <Divider sx={{ backgroundColor: "#bbdefb" }} />
            <DialogContent sx={{ backgroundColor: "#f1f8ff", padding: 3 }}>
                <Typography variant="body1" >
                    {text}
                </Typography>

                {/* Buttons inside the content box */}
                <DialogActions sx={{ gap: 2, mt: 2 }}>
                    <Button onClick={onDecline} color="error" variant="outlined" sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.3)",}}
                    >
                        {declineText}
                    </Button>
                    <Button onClick={onAccept} color="error" variant="contained" sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.3)",}}
                    >
                        {acceptText}
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;