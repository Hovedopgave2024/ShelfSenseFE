import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import ComponentsAddStockModal from "../components/components/ComponentsAddStockModal.jsx";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [CreateModal, setCreateModal] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const [componentToEdit, setComponentToEdit] = useState(null);
    const [addStockModal, setAddStockModal] = useState(false);
    const [componentToAddStock, setComponentToAddStock] = useState(null);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleCreateModal = () => {
        setCreateModal((prevOpen) => !prevOpen);
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
                        onClick={toggleCreateModal}
                    >
                        Create Component
                    </Button>
                </Box>
                <ComponentTable onEdit={handleEdit} onAddStock={handleAddStock}/>
                <ComponentsCreateModal open={CreateModal} onClose={toggleCreateModal} />
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
