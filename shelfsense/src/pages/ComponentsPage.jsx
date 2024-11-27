import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import ComponentsUpdateStockModal from "../components/components/ComponentsUpdateStockModal.jsx";


const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [CreateModal, setCreateModal] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const [UpdateStockModal, setUpdateStockModal] = useState(false);
    const [componentToEdit, setComponentToEdit] = useState(null);


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

    const toggleUpdateStockModal = () => {
        setUpdateStockModal((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Container sx={{ py: 4, overflow: "auto" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Components
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 3 }}
                        onClick={toggleCreateModal}
                    >
                        Create Component
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 3 }}
                        onClick={toggleUpdateStockModal}
                    >
                        Update Stock
                    </Button>
                </Box>
                <ComponentTable onEdit={handleEdit} />
                <ComponentsCreateModal open={CreateModal} onClose={toggleCreateModal} />
                <>
                    {componentToEdit && (
                        <ComponentsEditModal
                            open={EditModal}
                            onClose={() => setEditModal(false)}
                            component={componentToEdit}
                        />
                    )}
                </>
                <ComponentsUpdateStockModal
                    open={UpdateStockModal}
                    onClose={toggleUpdateStockModal}
                />
            </Container>
        </Box>
    );
}

export default ComponentsPage;
