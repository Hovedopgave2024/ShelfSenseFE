import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography, Box, useTheme,
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
                           color = "error",
                       }) => {
    const theme = useTheme(); // Access the current theme

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title" PaperProps={{
            sx: {
                borderRadius: 4,
                boxShadow: "10px 15px 25px rgba(0, 0, 0, 0.3)",
            },
        }}>
            <Box sx={{ backgroundColor: theme.palette.background.paper, padding: 1 }}>
                <DialogTitle id="dialog-title">
                    <Typography
                        variant="h5"
                    >
                        {headline}
                    </Typography>
                </DialogTitle>
            </Box>
            <Divider sx={{ backgroundColor: theme.palette.divider, }} />
            <DialogContent sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}>
                <Typography variant="body1" >
                    {text}
                </Typography>

                {/* Buttons inside the content box */}
                <DialogActions sx={{ gap: 2, mt: 2 }}>
                    <Button onClick={onDecline} color={color} variant="outlined" sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.3)",}}
                    >
                        {declineText}
                    </Button>
                    <Button onClick={onAccept} color={color} variant="contained" sx={{
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