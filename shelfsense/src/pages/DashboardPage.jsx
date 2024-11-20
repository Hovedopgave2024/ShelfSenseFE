import {Box, Typography} from "@mui/material";
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";


const DashboardPage = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Typography> Hello from dashboard </Typography>
        </Box>
    )
}

export default DashboardPage;