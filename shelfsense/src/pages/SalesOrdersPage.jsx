import {Box, Button} from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import SalesOrdersTable from "../components/salesOrders/SalesOrdersTable.jsx";
import SalesOrdersCreateModal from "../components/salesOrders/SalesOrdersCreateModal.jsx";

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
                     px: { xs: 2, sm: 3, md: 4, lg: 5 },
                     margin: "0 auto",
                 }}
            >
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleCreateModal}
                    >
                        Create Sales Order
                    </Button>
                </Box>
                <SalesOrdersCreateModal open={CreateModal} onClose={toggleCreateModal} />
                <SalesOrdersTable onEdit={handleEdit} />
                <>
                    {salesOrderToEdit && (
                        <ComponentsEditModal
                            open={EditModal}
                            onClose={() => setEditModal(false)}
                            component={salesOrderToEdit}
                        />
                    )}
                </>
            </Box>
        </Box>
    );
}

export default SalesOrdersPage;
