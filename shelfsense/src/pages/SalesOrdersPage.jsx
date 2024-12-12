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
    const [CreateModal, setCreateModal] = useState(false);

    const toggleDrawer = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleEdit = (salesOrder) => {
        setSalesOrderToEdit(salesOrder);
        setEditModal(true);
    };

    const toggleCreateModal = () => {
        setCreateModal((prevOpen) => !prevOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box overflow="auto"
                 sx={{
                     flex: 1,
                     pt: 4,
                     display: "flex",
                     flexDirection: { xs: 'column', md: 'column', lg: 'row' },
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
                <Box sx={{ display: "flex", justifyContent: "center", mx: 5}}>
                    <SalesOrdersCreateCard open={CreateModal} onClose={toggleCreateModal} />
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
