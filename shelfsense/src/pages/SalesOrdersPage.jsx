import {Box, Button} from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import SalesOrdersTable from "../components/salesOrders/SalesOrdersTable.jsx";
import SalesOrdersCreateCard from "../components/salesOrders/SalesOrdersCreateCard.jsx";

const SalesOrdersPage = () => {
    const [open, setOpen] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const [salesOrderToEdit, setSalesOrderToEdit] = useState(null);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleEdit = (salesOrder) => {
        setSalesOrderToEdit(salesOrder);
        setEditModal(true);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: { xs: 'column', md: 'column', lg: 'row' },
            }}>
                <Box overflow="auto"
                     sx={{
                         pt: 4,
                         px: { xs: 2, sm: 3, md: 4, lg: 5 },
                     }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <SalesOrdersTable onEdit={handleEdit} />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mx: 5}}>
                    <SalesOrdersCreateCard />
                </Box>
                {salesOrderToEdit && (
                    <ComponentsEditModal
                        open={EditModal}
                        onClose={() => setEditModal(false)}
                        component={salesOrderToEdit}
                    />
                )}
            </Box>
        </Box>
    );
}

export default SalesOrdersPage;
