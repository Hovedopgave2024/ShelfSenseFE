// ProductsPage.js
import { useState } from 'react';
import {Button, Box, CircularProgress, Tooltip} from '@mui/material';
import ProductsList from '../components/products/ProductsList';
import { Sidebar } from '../components/sidebar/sidebar.jsx';
import ProductCreateModal from '../components/products/ProductCreateModal.jsx';
import {createApiRequest} from "../services/component/createApiRequest.js";
import useComponentsStore from "../stores/useComponentsStore.js";
import useApiUpdateStore from "../stores/useApiUpdateStore.js"; // Import the modal
import calculateApiFetchTimeDif from '../util/component/calculateApiFetchTimeDif.js';
import ConfirmDialog from "../components/confirmDialog/ConfirmDialog.jsx"
import useSnackbarStore from "../stores/useSnackbarStore.js";


const ProductsPage = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const components = useComponentsStore((state) => state.components);
    const updateComponent = useComponentsStore((state) => state.updateComponent);
    const apiUpdate = useApiUpdateStore((state) => state.apiUpdate);
    const [dialogOpen, setDialogOpen] = useState(false);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

    const handleCloseDialog = () => setDialogOpen(false);

    const toggleDrawer = () => {
        setOpenSideBar((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    }

    const toggleConfirmFetchApiDialog = async () => {
        setDialogOpen(true);
    }

    const handleUpdateSupplierInfo = async () => {
        setDialogOpen(false);
        setLoading(true);

        try {
            const apiInfo = await createApiRequest();

            if (!apiInfo) {
                showSnackbar('error', 'API call to update supplier info failed, please try again or contact Support.');
                setLoading(false);
                return;
            }
            showSnackbar('success', 'API call to update supplier info was successful.');

            apiInfo.forEach((apiComponent) => {
                const componentInStore = components.find(
                    (comp) => comp.id === apiComponent.id
                );

                if (componentInStore) {
                    updateComponent({
                        id: apiComponent.id,
                        supplierStock: apiComponent.supplierStock,
                        supplierStockStatus: apiComponent.supplierStockStatus,
                        manufacturer: apiComponent.manufacturer,
                        manufacturerPart: apiComponent.manufacturerPart,
                        supplierIncomingStock: apiComponent.supplierIncomingStock,
                        supplierIncomingDate: apiComponent.supplierIncomingDate,
                    });
                    console.log("Updated component via the API:", apiComponent);
                    console.log("Updated Zustand components state:", components);
                } else {
                    console.log("Component didn't update via the API");
                }
            });
        } catch (err) {
            console.error("API call to update components failed", err);
            showSnackbar('error', 'API call to update supplier info failed, please try again or contact Support.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={openSideBar} toggleDrawer={toggleDrawer} />
            <Box
                sx={{
                    flex: 1,
                    transition: 'margin-left 0.3s',
                    flexDirection: 'column',
                    py: 4,
                    px: { xs: 2, sm: 3, md: 4, lg: 5 },
                    margin: "0 auto",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleModal}
                    sx={{ mb: 3 }}
                >
                    Create Product
                </Button>
                <>
                    <Tooltip arrow title={"Fetch API to update info from your supplier"}>
                        <span>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={toggleConfirmFetchApiDialog}
                                sx={{ mb: 3, ml: 3 }}
                            >
                                Fetch API
                            </Button>
                            <ConfirmDialog
                                open={dialogOpen}
                                onClose={handleCloseDialog}
                                headline="Confirm Fetch API"
                                text={
                                    <>
                                        Are you sure you want to fetch API, updating supplier info? <br />
                                        {apiUpdate?.lastUpdated
                                            ? `API last fetched ${calculateApiFetchTimeDif(apiUpdate.lastUpdated)}.`
                                            : 'API not fetched yet.'}
                                    </>
                                }
                                onAccept={handleUpdateSupplierInfo}
                                onDecline={handleCloseDialog}
                                acceptText="Fetch API"
                                declineText="Cancel"
                                color="info"
                            />
                        </span>
                    </Tooltip>
                </>
                {loading ? (
                    <CircularProgress sx={{ ml: 2 }} />
                ) : (
                    <Tooltip arrow title={`API fetched ${calculateApiFetchTimeDif(apiUpdate?.lastUpdated)}`}>
                        <span>
                            <Button sx={{ mb: 3 }} disabled>
                                {apiUpdate?.lastUpdated
                                    ? calculateApiFetchTimeDif(apiUpdate.lastUpdated)
                                    : 'API not fetched yet'}
                            </Button>
                        </span>
                    </Tooltip>
                )}
                <ProductsList />
                {/* Render the modal here */}
                <ProductCreateModal open={openModal} onClose={toggleModal} />
            </Box>
        </Box>
    );
};

export default ProductsPage;
