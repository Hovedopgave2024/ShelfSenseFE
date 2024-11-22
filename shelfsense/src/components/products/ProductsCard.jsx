import { Card, CardContent, Chip, Avatar, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { chipConfig } from '../../util/services/productService.jsx';

const ProductsCard = ({ product }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/components');
    };

    const stock1 = 80;
    const stock2 = 40;
    const safetyStock = 60;
    const safetyMultiplier = 1.25;

    const chip1Config = chipConfig(stock1, safetyStock, safetyMultiplier);
    const chip2Config = chipConfig(stock2, safetyStock, safetyMultiplier);

    return (
        <Card
            sx={{
                minHeight: 300,
                minWidth: 250,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(75, 0, 130, 0.7)',
                borderRadius: 3,
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="column" spacing={2}>
                    <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        justifyContent="center"
                        color="white"
                        sx={{ cursor: 'default' }}
                    >
                        {product.name}
                    </Typography>
                    <Card sx={{ borderRadius: 3 }}>
                        <Stack direction="column" spacing={1} sx={{ p: 2, pt: 1 }}>
                            <Typography
                                display="flex"
                                justifyContent="center"
                                variant="caption"
                                component="div"
                                sx={{ cursor: 'default' }}
                            >
                                Component stock
                            </Typography>
                            <Chip
                                sx={{
                                    borderRadius: '0 16px 16px 0',
                                    fontSize: '0.6rem',
                                    justifyContent: 'flex-start',
                                    cursor: 'default',
                                }}
                                color={chip1Config.color}
                                avatar={<Avatar>{chip1Config.icon}</Avatar>}
                                label={chip1Config.label}
                            />
                        </Stack>
                    </Card>
                    <Card sx={{ borderRadius: 3 }}>
                        <Stack direction="column" spacing={1} sx={{ p: 2, pt: 1 }}>
                            <Typography
                                display="flex"
                                justifyContent="center"
                                variant="caption"
                                component="div"
                            >
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
                        </Stack>
                    </Card>
                </Stack>
            </CardContent>
            <Button
                variant="contained"
                sx={{
                    margin: '15px',
                    borderRadius: 3,
                    backgroundColor: 'rgba(135, 206, 250)',
                    color: '#000',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: 'rgba(173, 216, 230)',
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
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