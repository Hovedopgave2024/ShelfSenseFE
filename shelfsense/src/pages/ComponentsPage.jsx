import { Container, Typography, Box } from '@mui/material';
import ComponentTable from '../components/components/ComponentsTable';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";

const ComponentsPage = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Our Components
                </Typography>
                <ComponentTable />
            </Container>
        </Box>
    );
}


export default ComponentsPage;
