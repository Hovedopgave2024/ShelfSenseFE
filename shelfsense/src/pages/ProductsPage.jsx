// ProductsPage.js
import { useState } from 'react';
import {Typography, Button, Box, CircularProgress, Tooltip} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductsList from '../components/products/ProductsList';
import { Sidebar } from '../components/sidebar/sidebar.jsx';
import useSessionStore from "../stores/useSessionStore.js";
import ProductCreateModal from '../components/products/ProductCreateModal.jsx';
import {createApiRequest} from "../util/services/ComponentService.jsx";
import useComponentsStore from "../stores/useComponentsStore.js";
import useApiUpdateStore from "../stores/useApiUpdateStore.js"; // Import the modal
import calculateApiFetchTimeDif from '../util/calculateApiFetchTimeDif.js';

const ProductsPage = () => {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSessionStore((state) => state.user);
    const components = useComponentsStore((state) => state.components);
    const updateComponent = useComponentsStore((state) => state.updateComponent);
    const apiUpdate = useApiUpdateStore((state) => state.apiUpdate);

    const toggleDrawer = () => {
        setOpenSideBar((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    }

    const updateSupplierInfo = async () => {
        setLoading(true);

        try {
            const apiInfo = await createApiRequest();

            console.log("Fetched API info:", apiInfo);

            apiInfo.forEach((apiComponent) => {
                const componentInStore = components.find(
                    (comp) => comp.id === apiComponent.id
                );

                if (componentInStore) {
                    updateComponent({
                        id: apiComponent.id,
                        supplierStock: apiComponent.supplierStock,
                        manufacturer: apiComponent.manufacturer,
                        manufacturerPart: apiComponent.manufacturerPart,
                        supplierIncomingStock: apiComponent.supplierIncomingStock,
                        supplierIncomingDate: apiComponent.supplierIncomingDate,
                    });
                    console.log("Updated component via the API:", apiComponent);
                } else {
                    console.log("Component didn't update via the API");
                }
            });
        } catch (err) {
            console.error("API call to update components failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = () => {
        navigate('/components');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={openSideBar} toggleDrawer={toggleDrawer} />
            <Box
                sx={{
                    flexGrow: 1,
                    transition: 'margin-left 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                }}
            >
                <Typography variant="h6" align="right" sx={{ width: '100%', mb: 2 }}>
                    Hello {user ? user.name : 'Guest'}
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                    Our Products
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNavigation}
                    sx={{ mb: 3 }}
                >
                    Go to Components
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={toggleModal}
                    sx={{ mb: 3 }}
                >
                    Create Product
                </Button>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Box
                        sx={{
                            mb: 3,
                        }}
                    >
                        <Tooltip arrow title={"Fetch API to update info from your supplier"}>
                            <span>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={updateSupplierInfo}
                                >
                                    Fetch API
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip arrow title={`API fetched ${calculateApiFetchTimeDif(apiUpdate?.lastUpdated)}`}>
                            <span>
                                <Button disabled>
                                    {apiUpdate?.lastUpdated
                                        ? calculateApiFetchTimeDif(apiUpdate.lastUpdated)
                                        : 'API not fetched yet'}
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>

                )}
                <ProductsList />
                {/* Render the modal here */}
                <ProductCreateModal open={openModal} onClose={toggleModal} />
            </Box>
        </Box>
    );
};

export default ProductsPage;
