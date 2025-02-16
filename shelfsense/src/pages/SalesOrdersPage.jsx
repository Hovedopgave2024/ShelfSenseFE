import {Box} from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import SalesOrdersTable from "../components/salesOrders/SalesOrdersTable.jsx";
import SalesOrdersCreateCard from "../components/salesOrders/SalesOrdersCreateCard.jsx";
import useSalesOrdersStore from "../stores/useSalesOrdersStore.js";
import useSnackbarStore from "../stores/useSnackbarStore.js";
import useProductsStore from "../stores/useProductsStore.js";
import useComponentsStore from "../stores/useComponentsStore.js";
import ConfirmDialog from "../components/confirmDialog/ConfirmDialog.jsx";
import {deleteSalesOrder} from "../services/salesOrder/deleteSalesOrder.js";
import calculateStatus from "../util/component/calculateStockStatus.js";

const SalesOrdersPage = () => {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
    const deleteSalesOrderInStore = useSalesOrdersStore(state => state.deleteSalesOrder);
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);
    const products = useProductsStore(state => state.products);
    const components = useComponentsStore(state => state.components);
    const updateComponent = useComponentsStore(state => state.updateComponent);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleDeleteSalesOrder = (salesOrder) => {
        setSelectedSalesOrder(salesOrder);
        setDialogOpen(true);
    };

    // Close Dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedSalesOrder(null);
    };

    const confirmDeleteSalesOrder = async () => {
        if (!selectedSalesOrder) return;

        setDialogOpen(false);

        const deleteProductResult = await deleteSalesOrder(selectedSalesOrder.id);
        if (!deleteProductResult) {
            showSnackbar('error', 'Error: Sales order was not deleted. Please try again or contact Support');
            return;
        }

        deleteSalesOrderInStore(selectedSalesOrder.id);

        const product = products.find((product) => product.id === selectedSalesOrder.productId);
        if (product && product.productComponentList.length !== 0) {
            product.productComponentList.forEach((pc) => {
                const component = components.find((component) => component.id === pc.componentId);
                if (component) {
                    const requiredQuantity = parseInt(pc.quantity) * parseInt(selectedSalesOrder.quantity);
                    const updatedStock = parseInt(component.stock) + requiredQuantity;

                    updateComponent({
                        ...component,
                        stock: Number(updatedStock),
                        stockStatus: calculateStatus(Number(updatedStock), Number(component.safetyStock), Number(component.safetyStockRop)),
                    });
                }
            });
        }

        showSnackbar('success', 'Sales order deleted successfully.');
        setSelectedSalesOrder(null);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                }}
            >
                {/* Table Section with Scrollable Height */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        pt: 4,
                        px: { xs: 2, sm: 3, md: 4, lg: 5 },
                    }}
                >
                    <SalesOrdersTable onDelete={handleDeleteSalesOrder} />
                </Box>

                {/* Create Sales Order Section */}
                <Box
                    sx={{
                        mt: 2,
                        mx: { xs: 2, sm: 3, md: 4, lg: 5 },
                        p: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <SalesOrdersCreateCard />
                </Box>
            </Box>
            <ConfirmDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                headline="Confirm Deletion"
                text="Are you sure you want to delete this component? This action cannot be undone."
                onAccept={confirmDeleteSalesOrder}
                onDecline={handleCloseDialog}
                acceptText="Delete"
                declineText="Cancel"
            />
        </Box>
    );
}

export default SalesOrdersPage;
