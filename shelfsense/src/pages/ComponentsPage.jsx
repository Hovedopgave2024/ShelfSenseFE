import { Container, Typography, Box, Button } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsCreateModal from "../components/components/ComponentsCreateModal.jsx";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);


    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleModal = () => {
        setOpenModal((prevOpen) => !prevOpen);
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
                <ComponentTable />
                <ComponentsCreateModal open={openModal} onClose={toggleModal} />
            </Container>
        </Box>
    );
}

export default ComponentsPage;
