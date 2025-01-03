import {Box} from '@mui/material';
import {useState} from "react";
import {Sidebar} from "../components/sidebar/sidebar.jsx";
import SalesOrdersEditModal from "../components/salesOrders/SalesOrdersEditModal.jsx";
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
                    <SalesOrdersTable onEdit={handleEdit} />
                </Box>

                {/* Create Sales Order Section */}
                <Box
                    sx={{
                        mt: 2,
                        mx: { xs: 2, sm: 3, md: 4, lg: 5 },
                        p: 2,
                        backgroundColor: 'background.paper', // Optional styling for distinction
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <SalesOrdersCreateCard />
                </Box>

                {/* Edit Modal */}
                {salesOrderToEdit && (
                    <SalesOrdersEditModal
                        open={EditModal}
                        onClose={() => setEditModal(false)}
                        salesOrder={salesOrderToEdit}
                    />
                )}
            </Box>
        </Box>
    );
}

export default SalesOrdersPage;
