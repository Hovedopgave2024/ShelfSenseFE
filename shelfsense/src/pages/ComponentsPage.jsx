import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import ComponentsAddStockModal from "../components/components/ComponentsAddStockModal.jsx";
import {useLocation, useNavigate} from "react-router-dom";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [CreateModal, setCreateModal] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const [componentToEdit, setComponentToEdit] = useState(null);
    const [addStockModal, setAddStockModal] = useState(false);
    const [componentToAddStock, setComponentToAddStock] = useState(null);

    // Get the component IDs passed from the previous page
    const location = useLocation();
    const passedComponentIds = location.state?.componentIds || [];
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleOpenCreateModal = () => {
        setCreateModal((prevOpen) => !prevOpen);
    };

    const toggleCloseCreateModal = () => {
        setCreateModal((prevOpen) => !prevOpen);
        //navigate(0);
    };

    const handleEdit = (component) => {
        setComponentToEdit(component);
        setEditModal(true);
    };

    const handleAddStock = (component) => {
        setComponentToAddStock(component); // Set the selected component
        setAddStockModal(true); // Open the Add Stock Modal
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box overflow="auto"
                sx={{
                    flex: 1,
                    pt: 4,
                    px: { xs: 2, sm: 3, md: 4, lg: 5 },
                    margin: "0 auto",
                }}
            >
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleOpenCreateModal}
                    >
                        Create Component
                    </Button>
                </Box>
                {/* Passing the components with prop */}
                <ComponentTable
                    onEdit={handleEdit}
                    onAddStock={handleAddStock}
                    productComponentIds={passedComponentIds}/>

                <ComponentsCreateModal open={CreateModal} onClose={toggleCloseCreateModal} />
                <>
                    {componentToEdit && (
                        <ComponentsEditModal
                            open={EditModal}
                            onClose={() => setEditModal(false)}
                            component={componentToEdit}
                        />
                    )}
                    {componentToAddStock && (
                        <ComponentsAddStockModal
                            open={addStockModal}
                            onClose={() => setAddStockModal(false)} // Close the modal
                            component={componentToAddStock} // Pass the selected component
                        />
                    )}
                </>
            </Box>
        </Box>
    );
}

export default ComponentsPage;
