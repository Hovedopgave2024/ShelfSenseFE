import {useState} from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import {Typography} from "@mui/material";
import DataManipulationBar from '../dataManipulationBar/DataManipulationBar.jsx';
import { useTheme } from "@mui/material";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import SalesOrdersTableRow from "./SalesOrdersTableRow.jsx";

const SalesOrdersTable = ({ onEdit }) => {
    const salesOrders = useSalesOrdersStore((state) => state.salesOrders);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);
    const productNames = [...new Set(salesOrders.map(salesOrder => salesOrder.productName))];
    const columnTitles = ["CreatedDate", "Product Name", "Quantity", "Price", "Actions"];
    const theme = useTheme();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    console.log(salesOrders);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box>
            <DataManipulationBar
                data={salesOrders}
                onUpdate={setFilteredSalesOrders}
                filterOptions={[
                    { key: 'productName', label: 'Product Name', values: productNames },
                ]}
                sortOptions={columnTitles.map((title) => ({
                    key: title.toLowerCase(),
                    label: title,
                }))}
                searchOptions={[
                    { key: 'productName', label: 'Product Name' },
                ]}
            />
            <Paper
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxHeight: { xs: '35vh', sm: '45vh', md: '55vh', lg: '65vh', xl: '75vh' },
                    overflow: 'auto',
                }}
            >
                <TableContainer>
                    <Table stickyHeader aria-label="components table">
                        <TableHead>
                            <TableRow>
                                {columnTitles.map((title, index) => (
                                    <TableCell
                                        align="left"
                                        key={index}
                                        sx={{
                                            backgroundColor: theme.palette.background.paper, // Dynamic color based on theme
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        {title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSalesOrders && filteredSalesOrders.length > 0 ? (
                                filteredSalesOrders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data) => (
                                        <SalesOrdersTableRow
                                            key={data.id}
                                            salesOrder={data}
                                            onEdit={onEdit}
                                        />
                                    ))
                            ) : (
                                <TableRow>
                                    {[...Array(columnTitles.length)].map((_, index) => (
                                        <TableCell key={index}>
                                            <Skeleton animation="wave" variant="rectangular" height={25} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {(!filteredSalesOrders || filteredSalesOrders.length === 0) && (
                    <Typography align="center">No components available</Typography>
                )}
            </Paper>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Align pagination to the right
                    mt: 2, // Add spacing above pagination
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={filteredSalesOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

export default SalesOrdersTable;