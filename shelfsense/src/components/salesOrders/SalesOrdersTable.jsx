import { useState } from "react";
import {
    Box,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import SalesOrdersTableRow from "./SalesOrdersTableRow.jsx";
import DataManipulationBar from "../dataManipulationBar/DataManipulationBar.jsx";

const SalesOrdersTable = ({ onDelete }) => {
    const salesOrders = useSalesOrdersStore((state) => state.salesOrders);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filteredSalesOrders, setFilteredSalesOrders] = useState([]);
    const theme = useTheme();

    const columnTitles = ["Created Date", "Price", "Products", "Actions"];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box>
            <DataManipulationBar
                data={salesOrders}
                onUpdate={setFilteredSalesOrders}
                filterOptions={[]} // No filtering right now
                sortOptions={columnTitles.map((title) => ({
                    key: title.toLowerCase(),
                    label: title,
                }))}
                searchOptions={[]} // Searching per sales order, not per product
            />
            <Paper
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxHeight: { xs: "35vh", sm: "45vh", md: "55vh", lg: "65vh", xl: "75vh" },
                    overflow: "auto",
                }}
            >
                <TableContainer>
                    <Table stickyHeader aria-label="sales orders table">
                        <TableHead>
                            <TableRow>
                                {columnTitles.map((title, index) => (
                                    <TableCell
                                        align="left"
                                        key={index}
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
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
                            {filteredSalesOrders.length > 0 ? (
                                filteredSalesOrders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((salesOrder) => (
                                        <SalesOrdersTableRow
                                            key={salesOrder.id}
                                            salesOrder={salesOrder}
                                            onDelete={onDelete}
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
                {filteredSalesOrders.length === 0 && (
                    <Typography align="center">No sales orders available</Typography>
                )}
            </Paper>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
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