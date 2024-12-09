import { Box } from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import ComponentsEditModal from "../components/components/ComponentsEditModal.jsx";
import SalesOrdersTable from "../components/salesOrders/SalesOrdersTable.jsx";

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
            <Box overflow="auto"
                 sx={{
                     flex: 1,
                     pt: 4,
                     px: { xs: 2, sm: 3, md: 4, lg: 5 },
                     margin: "0 auto",
                 }}
            >
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
