import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [componentToEdit, setComponentToEdit] = useState(null);


    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    };

    const handleEdit = (component) => {
        setComponentToEdit(component);
        setOpenEditModal(true);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Container sx={{ py: 4, overflow: "auto" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Our Components
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={toggleModal}
                >
                    Create Component
                </Button>
                <ComponentTable onEdit={handleEdit} />
                <ComponentsCreateModal open={openModal} onClose={toggleModal} />
                <>
                    {componentToEdit && (
                        <ComponentsEditModal
                            open={openEditModal}
                            onClose={() => setOpenEditModal(false)}
                            component={componentToEdit}
                        />
                    )}
                </>
            </Container>
        </Box>
    );
}

export default ComponentsPage;
