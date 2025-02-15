import {Box} from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import SalesOrdersTable from "../components/salesOrders/SalesOrdersTable.jsx";
import SalesOrdersCreateCard from "../components/salesOrders/SalesOrdersCreateCard.jsx";

const SalesOrdersPage = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                }}
            >
                {/* Table Section with Scrollable Height */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        pt: 4,
                        px: { xs: 2, sm: 3, md: 4, lg: 5 },
                    }}
                >
                    <SalesOrdersTable onEdit={null} />
                </Box>

                {/* Create Sales Order Section */}
                <Box
                    sx={{
                        mt: 2,
                        mx: { xs: 2, sm: 3, md: 4, lg: 5 },
                        p: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <SalesOrdersCreateCard />
                </Box>
            </Box>
        </Box>
    );
}

export default SalesOrdersPage;
