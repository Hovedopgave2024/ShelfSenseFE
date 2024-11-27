import { Modal, Box, Typography, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useState } from "react";

const ComponentsUpdateStockModal = ({ open, onClose }) => {
    const [formData, setFormData] = useState({}); // Placeholder for form data

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Implement the stock update logic here
        console.log("Updated stock:", formData);
        onClose(); // Close the modal after submitting
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: 500,
                }}
            >
                <Typography variant="h6" component="h2" mb={2}>
                    Update Component Stock
                </Typography>
                <Grid container spacing={2}>
                    {/* Example input */}
                    <Grid xs={12}>
                        <input
                            type="text"
                            name="stock"
                            placeholder="Enter stock value"
                            value={formData.stock || ""}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default ComponentsUpdateStockModal;