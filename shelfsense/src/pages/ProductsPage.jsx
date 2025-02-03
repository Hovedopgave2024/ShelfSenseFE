// ProductsPage.js
import { useState } from 'react';
import {Button, Box, Tooltip} from '@mui/material';
import ProductsList from '../components/products/ProductsList';
import { Sidebar } from '../components/sidebar/sidebar.jsx';
import ProductCreateModal from '../components/products/ProductCreateModal.jsx';
import useApiUpdateStore from "../stores/useApiUpdateStore.js"; // Import the modal
import calculateApiFetchTimeDif from '../util/component/calculateApiFetchTimeDif.js';
import ConfirmDialog from "../components/confirmDialog/ConfirmDialog.jsx"

const ProductsPage = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const apiUpdate = useApiUpdateStore((state) => state.apiUpdate);
    const [dialogOpen, setDialogOpen] = useState(false);

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
                                        Supplier info for your Mouser components now updates automatically in the background every day at 2 AM (Copenhagen time). <br />
                                        {apiUpdate?.lastUpdated
                                            ? `API last fetched ${calculateApiFetchTimeDif(apiUpdate.lastUpdated)}.`
                                            : 'API not fetched yet.'}
                                    </>
                                }
                                onAccept={handleCloseDialog}
                                onDecline={handleCloseDialog}
                                acceptText="Understood"
                                declineText="Understood"
                                color="info"
                            />
                        </span>
                    </Tooltip>
                </>
                <Tooltip arrow title={`API fetched ${calculateApiFetchTimeDif(apiUpdate?.lastUpdated)}`}>
                    <span>
                        <Button sx={{ mb: 3 }} disabled>
                            {apiUpdate?.lastUpdated
                                ? calculateApiFetchTimeDif(apiUpdate.lastUpdated)
                                : 'API not fetched yet'}
                        </Button>
                    </span>
                </Tooltip>
                <ProductsList />
                <ProductCreateModal open={openModal} onClose={toggleModal} />
            </Box>
        </Box>
    );
};

export default ProductsPage;
