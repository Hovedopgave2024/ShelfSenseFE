import {Box, Typography} from "@mui/material";
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";


const AboutPage = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Typography> Hello from about page </Typography>
        </Box>
    )
}

export default AboutPage;