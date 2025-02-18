import { Card, CardContent, Chip, Avatar, Stack, Typography, Button } from '@mui/material';
import { useState } from "react";
import ProductModal from "./ProductModal.jsx";
import useComponentsStore from "../../stores/useComponentsStore.js";
import { statusLabel } from '../../util/component/ComponentStatusLabel.jsx';
import UpdateProductModal from "./ProductsEditModal.jsx";

const ProductsCard = ({ product }) => {

    const [openModal, setOpenModal] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    }

    const components = useComponentsStore((state) => state.components);

    // Function to find the lowest status from a list of statuses
    const findLowestStatus = (statuses) => {
        return statuses.reduce((lowest, current) => current < lowest ? current : lowest, Infinity);
    }

    // Extract all stockStatus values from the product's components
    const stockStatuses = product.productComponentList.map((productComponent) => {
        const component = components.find(c => c.id === productComponent.componentId);
        return component ? component.stockStatus : null;
    }).filter(status => status !== null);

    // Extract all supplierStockStatus values from the product's components
    const supplierStockStatuses = product.productComponentList.map((productComponent) => {
        const component = components.find(c => c.id === productComponent.componentId);
        return component ? component.supplierStockStatus : null;
    }).filter(status => status !== null);

    // Determine the lowest (most critical) stockStatus
    const lowestStockStatusValue = findLowestStatus(stockStatuses);
    const stockStatus = lowestStockStatusValue !== Infinity ? statusLabel(lowestStockStatusValue) : statusLabel(null);

    // Determine the lowest (most critical) supplierStockStatus
    const lowestSupplierStockStatusValue = findLowestStatus(supplierStockStatuses);
    const supplierStockStatus = lowestSupplierStockStatusValue !== Infinity ? statusLabel(lowestSupplierStockStatusValue) : statusLabel(null);



    return (
        <Card

            sx={{
                mt: 2,
                minHeight: 300,
                minWidth: 250,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
            }}
        >
            <CardContent sx={{ flexGrow: 1,  }}>
                <Stack direction="column" spacing={2}>
                    <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        justifyContent="center"
                        sx={{ cursor: 'default' }}
                    >
                        {product.name}
                    </Typography>

                    {/* Component Stock Status */}
                    <Card sx={{ borderRadius: 3 }}>
                        <Stack direction="column" spacing={1} sx={{ p: 2, pt: 1 }}>
                            <Typography
                                display="flex"
                                justifyContent="center"
                                variant="caption"
                                component="div"
                                sx={{ cursor: 'default' }}
                            >
                                Component Stock
                            </Typography>
                            <Chip
                                sx={{
                                    borderRadius: '0 16px 16px 0',
                                    fontSize: '0.6rem',
                                    justifyContent: 'flex-start',
                                    cursor: 'default',
                                    backgroundColor: stockStatus.color,
                                    color: 'white',
                                }}
                                color={stockStatus.color}
                                avatar={<Avatar>{stockStatus.icon}</Avatar>}
                                label={stockStatus.label}
                                variant="filled"
                            />
                        </Stack>
                    </Card>

                    {/* Supplier Stock Status */}
                    <Card sx={{ borderRadius: 3 }}>
                        <Stack direction="column" spacing={1} sx={{ p: 2, pt: 1 }}>
                            <Typography
                                display="flex"
                                justifyContent="center"
                                variant="caption"
                                component="div"
                            >
                                Vendor Stock
                            </Typography>
                            <Chip
                                sx={{
                                    borderRadius: '0 16px 16px 0',
                                    fontSize: '0.6rem',
                                    justifyContent: 'flex-start',
                                    cursor: 'default',
                                    backgroundColor: supplierStockStatus.color,
                                    color: 'white',
                                }}
                                color={supplierStockStatus.color}
                                label={supplierStockStatus.label}
                                avatar={<Avatar>{supplierStockStatus.icon}</Avatar>}
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
                }}
                onClick={toggleModal}
            >
                Open Product
            </Button>
            <Button
                variant="outlined"
                sx={{
                    margin: '15px',
                    borderRadius: 3,
                }}
                onClick={handleOpenUpdateModal}
            >
                Edit Product
            </Button>
            {openModal && <ProductModal open={openModal} onClose={toggleModal} product={{product}} />}
            {isUpdateModalOpen && (
                <UpdateProductModal
                    open={isUpdateModalOpen}
                    onClose={handleCloseUpdateModal}
                    product={product}
                />
            )}
        </Card>
    );
};

export default ProductsCard;