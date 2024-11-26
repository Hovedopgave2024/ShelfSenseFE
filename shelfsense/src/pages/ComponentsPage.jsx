import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false); // For edit modal
    const [componentToEdit, setComponentToEdit] = useState(null); // Selected component for editing


    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
    };

    // Function to handle the "Edit" button click
    const handleEdit = (component) => {
        setComponentToEdit(component); // Set the selected component
        setOpenEditModal(true); // Open the edit modal
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Container sx={{ py: 4 }}>
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
                <ComponentTable onEdit={handleEdit} /> {/* Pass onEdit to the table */}
                <ComponentsCreateModal open={openModal} onClose={toggleModal} />
                {componentToEdit && (
                    <ComponentsEditModal
                        open={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        component={componentToEdit} // Pass the selected component
                    />
                )}
            </Container>
        </Box>
    );
}

export default ComponentsPage;
