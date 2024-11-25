import { Card, CardContent, Chip, Avatar, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { stockCalculator } from '../../util/services/componentService.jsx';
import {useState} from "react";
import ProductModal from "./ProductModal.jsx";
import useComponentsStore from "../../stores/useComponentsStore.js";

const ProductsCard = ({ product }) => {
    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    }

    const components = useComponentsStore((state) => state.components);

    const lowestStatus = product.productComponentList.map((productComponent) => {
        const component = components.find(
            (c) => c.id === productComponent.componentId
        );

        if (component) {
            // Calculate stock status using stockCalculator
            const status = stockCalculator(
                component.stock,
                component.safetyStock,
                component.safetyStockRop
            );

            return {
                label: status.label,
                icon: status.icon,
                color: status.color,
                remaining: status.remaining,
            };
        }
        return null; // Handle case when component is not found
    })
        .filter((status) => status !== null) // Filter out null values
        .reduce((lowest, current) =>
            current.remaining < lowest.remaining ? current : lowest,
            { label: "No Data", icon: null, color: "gray", remaining: Infinity } // Default value
        );

    // Now you can destructure the result to get label, icon, and color
    const { label, icon, color } = lowestStatus;

    const stock1 = 80;
    const stock2 = 40;
    const safetyStock = 60;
    const safetyStockROP = 1.25;

    const stockCalculator1 = stockCalculator(stock1, safetyStock, safetyStockROP);
    const stockCalculator2 = stockCalculator(stock2, safetyStock, safetyStockROP);


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
                                color={lowestStatus.color}
                                avatar={<Avatar>{lowestStatus.icon}</Avatar>}
                                label={lowestStatus.label}
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
                                color={stockCalculator2.color}
                                label={stockCalculator2.label}
                                avatar={<Avatar>{stockCalculator2.icon}</Avatar>}
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
            onClick={() => {toggleModal();}}
            >
                Open Product
            </Button>

            {/* Render the ProductModal outside the Button */}
            {openModal && <ProductModal open={openModal} onClose={toggleModal} product={{product}} />}
        </Card>
    );
};

export default ProductsCard;