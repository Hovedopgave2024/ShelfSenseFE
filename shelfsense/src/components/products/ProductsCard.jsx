import { Card, CardContent, Chip, Avatar, Stack, Typography, Button, Box, Slider, Tooltip } from '@mui/material';
import { CheckCircleOutlined, WarningOutlined, ErrorOutlined } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const ProductsCard = ({ product }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/components');
    };

    const stock1 = 80; // Example stock level for the first chip
    const stock2 = 40; // Example stock level for the second chip
    const safetyStock = 60; // Safety stock level

    const componentChipConfig = (stock) => {
        const stockPercentage = (stock / safetyStock) * 100 - 100;
        const extraStock = stock - safetyStock;

        if (stock >= safetyStock * 1.25) {
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

    const mouserChipConfig = (stock) => {
        const stockPercentage = (stock / safetyStock) * 100 - 100;
        const extraStock = stock - safetyStock;

        if (stock >= safetyStock * 1.25) {
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

    const chip1Config = componentChipConfig(stock1);
    const chip2Config = mouserChipConfig(stock2);

    const renderSliderWithTooltip = (percentage, extraStock, color) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={`${Math.round(percentage)}% from safety stock`} arrow>
                <Slider
                    value={percentage}
                    min={0}
                    max={50}
                    valueLabelDisplay="off"
                    color={color}
                    sx={{ flexGrow: 1}}
                />
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
                {extraStock >= 0 ? `+${extraStock} units` : `${extraStock} units`}
            </Typography>
        </Box>
    );

    return (
        <Card sx={{ minHeight: 300, minWidth: 250, display: 'flex', flexDirection: 'column', backgroundColor: "rgba(75, 0, 130, 0.7)", borderRadius: 3}}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h6" component="div" display="flex" justifyContent="center" color="white">
                        {product.name}
                    </Typography>
                    <Card sx={{ borderRadius: 3 }}>
                        <Stack direction="column" spacing={1} sx={{px: 2, pt: 1}}>
                            <Typography display="flex" justifyContent="center" variant="caption" component="div">
                                Component stock
                            </Typography>
                            <Chip
                                sx={{
                                    borderRadius: '0 16px 16px 0',
                                    fontSize: '0.6rem',
                                    justifyContent: 'flex-start',
                                }}
                                color={chip1Config.color}
                                avatar={<Avatar>{chip1Config.icon}</Avatar>}
                                label={chip1Config.label}
                            />
                            {renderSliderWithTooltip(chip1Config.percentage, chip1Config.extraStock, chip1Config.color)}
                        </Stack>
                    </Card>
                    <Card sx={{ borderRadius: 3}}>
                        <Stack direction="column" spacing={1} sx={{px: 2, pt: 1}}>
                            <Typography display="flex" justifyContent="center" variant="caption" component="div">
                                Vendor stock
                            </Typography>
                            <Chip
                                sx={{
                                    borderRadius: '16px 0 0 16px',
                                    fontSize: '0.6rem',
                                    justifyContent: 'flex-end',
                                }}
                                color={chip2Config.color}
                                label={chip2Config.label}
                                avatar={<Avatar>{chip2Config.icon}</Avatar>}
                            />
                            {renderSliderWithTooltip(chip2Config.percentage, chip2Config.extraStock, chip2Config.color)}
                        </Stack>
                    </Card>
                </Stack>
            </CardContent>
            <Button
                variant="contained"
                sx={{
                    margin: "15px",
                    borderRadius: 3,
                    backgroundColor: "rgba(135, 206, 250)",
                    color: "#000", // Dark text for contrast
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    '&:hover': {
                        backgroundColor: "rgba(173, 216, 230)",
                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
                    },
                }}
                onClick={handleNavigation}
            >
                Open Product
            </Button>
        </Card>
    );
};

export default ProductsCard;