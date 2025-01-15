import { Box, Typography, Container, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, useTheme } from "@mui/material";
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CheckCircleOutlined, WarningAmber, ErrorOutline, RemoveCircleOutline } from "@mui/icons-material";



const AboutPage = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, backgroundColor: theme.palette.background.default }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box component="main" sx={{ flexGrow: 1, maxWidth: '800px' }}>
                <Accordion
                    square
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                            Understanding Stock Status: Your Stock vs. Supplier Stock
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <Divider sx={{ mb: 4 }} />

                            <Typography variant="body1" paragraph>
                                When managing your inventory, it’s crucial to keep track of both:
                            </Typography>

                            <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
                                1. <strong>Your Stock:</strong> The amount of a component you have in your own inventory.
                            </Typography>
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                2. <strong>Supplier Stock:</strong> The amount of the same component available from your supplier.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                                By setting your own <strong>Safety Stock</strong> and <strong>Reorder Point (ROP)</strong>, as well as thresholds for the <strong>supplier's stock</strong>, you can use the system to make smarter ordering decisions and avoid stockouts or delays.
                            </Typography>

                            <Divider sx={{ mt: 4}} />

                            <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                1. Your Safety Stock and Reorder Point (ROP)
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 1 }} paragraph>
                                - <strong>Safety Stock:</strong> The minimum stock you want to keep on hand to avoid running out during unexpected delays or high demand.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                - <strong>Reorder Point (ROP):</strong> The stock level at which you should place a new order to replenish your inventory before reaching critical levels.
                            </Typography>

                            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                                Statuses for Your Stock:
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleOutlined style={{ color: 'green' }} />
                                <span style={{ color: 'green' }}>In Stock:</span> Your stock is above the ROP – no immediate action is needed.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningAmber style={{ color: 'orange' }} />
                                <span style={{ color: 'orange' }}>Low:</span> Your stock is between your Safety Stock and ROP – consider reordering soon.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutline style={{ color: 'red' }} />
                                <span style={{ color: 'red' }}>Warning:</span> Your stock is close to or slightly above your Safety Stock – time to reorder.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RemoveCircleOutline style={{ color: 'grey' }} />
                                <span style={{ color: 'grey' }}>Critical:</span> Your stock is at or below your Safety Stock – urgent action required.
                            </Typography>

                            <Divider sx={{ mt: 4 }} />

                            <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                2. Supplier Safety Stock and Reorder Point (ROP)
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 1 }} paragraph>
                                - <strong>Supplier Safety Stock:</strong> The minimum stock you believe the supplier should have before it’s "critical."
                            </Typography>
                            <Typography variant="body1" paragraph>
                                - <strong>Supplier ROP:</strong> The stock level at the supplier’s warehouse that indicates when they’re running low and you should place an order before their stock drops further.
                            </Typography>

                            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                                Statuses for Supplier Stock:
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleOutlined style={{ color: 'green' }} />
                                <span style={{ color: 'green' }}>In Stock:</span> The supplier’s stock is above their ROP – they have plenty of stock available.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningAmber style={{ color: 'orange' }} />
                                <span style={{ color: 'orange' }}>Reorder Soon:</span> The supplier’s stock has fallen below their ROP – it’s time to consider placing an order to secure stock.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorOutline style={{ color: 'red' }} />
                                <span style={{ color: 'red' }}>Warning:</span> The supplier’s stock is approaching their Safety Stock – they’re getting critically low.
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RemoveCircleOutline style={{ color: 'grey' }} />
                                <span style={{ color: 'grey' }}>Critical:</span> The supplier’s stock is at or below their Safety Stock – urgent action required.
                            </Typography>

                            <Divider sx={{ mt: 4}} />

                            <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                Stock Level Calculation
                            </Typography>

                            <Typography variant="body1" paragraph>
                                The system calculates the stock status based on your current stock, safety stock, and reorder point (ROP). Here’s how the calculations work:
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                                - <strong style={{ color: 'green' }}>In Stock: </strong>
                                Your current stock is <strong>higher than the reorder point (ROP)</strong>.
                                Formula: <code>{"current stock > ROP"}</code>
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                                - <strong style={{ color: 'orange' }}>Low: </strong>
                                Your current stock is <strong>below the reorder point but above halfway to the safety stock</strong>.
                                Formula: <code>{"(safety stock + ROP) / 2 < current stock <= ROP"}</code>
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                                - <strong style={{ color: 'red' }}>Warning: </strong>
                                Your current stock is <strong>between the safety stock and halfway to the reorder point</strong>.
                                Formula: <code>{"safety stock < current stock <= (safety stock + ROP) / 2"}</code>
                            </Typography>

                            <Typography variant="body1" paragraph sx={{ ml: 2 }}>
                                - <strong style={{ color: 'grey' }}>Critical: </strong>
                                Your current stock is <strong>at or below the safety stock</strong>.
                                Formula: <code>{"current stock <= safety stock"}</code>
                            </Typography>

                            <Typography variant="body1" paragraph>
                                This simple calculation helps you know when it’s time to reorder or take urgent action to avoid running out of stock.
                            </Typography>

                            <Divider sx={{ mt: 4}} />

                            <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                Scenario Example
                            </Typography>

                            <Typography variant="body1" paragraph>
                                <strong>Component:</strong> Custom Sensor<br />
                                <strong>Your Safety Stock:</strong> 100 units<br />
                                <strong>Your ROP:</strong> 200 units<br />
                                <strong>Supplier Safety Stock:</strong> 500 units<br />
                                <strong>Supplier ROP:</strong> 1,000 units<br />
                            </Typography>

                            <Typography variant="body1" paragraph>
                                <strong>Stock Levels:</strong><br />
                                - Your stock: 180 units (Low)<br />
                                - Supplier stock: 900 units (Reorder Soon)<br />
                            </Typography>

                            <Typography variant="body1" paragraph>
                                <strong>Status Interpretation:</strong> Your stock is below your ROP, meaning you need to reorder soon. The supplier’s stock is also below their ROP, meaning they’re running low too. You should place an order immediately to ensure you secure the stock before the supplier’s inventory gets critically low.
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    square
                    elevation={0}
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        mt: 4, // Adds space between this and the previous accordion
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                            Support and Contact
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                            <Typography variant="body1" paragraph>
                                If you need assistance or have questions regarding the system, our support team is here to help you.
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                Support Email:
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <a href="mailto:support@shelfsense.com" style={{ color: theme.palette.primary.main }}>
                                    support@shelfsense.com
                                </a>
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                                General Inquiries:
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <a href="mailto:contact@shelfsense.com" style={{ color: theme.palette.primary.main }}>
                                    contact@shelfsense.com
                                </a>
                            </Typography>

                            <Typography variant="body1" paragraph>
                                Please include a brief description of your issue or question, and our team will get back to you as soon as possible.
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>

            </Box>
        </Box>
    );
}

export default AboutPage;