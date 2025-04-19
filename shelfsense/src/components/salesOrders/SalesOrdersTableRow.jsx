import { useState } from "react";
import {
    TableRow,
    TableCell,
    Collapse,
    Box,
    Table,
    TableBody,
    TableHead,
    Button, Paper, TableContainer
} from "@mui/material";
import useProductsStore from "../../stores/useProductsStore.js";
import {useTheme} from "@mui/material/styles"; // ✅ Import product store

const SalesOrdersTableRow = ({ salesOrder, onDelete }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [open, setOpen] = useState(false);
    const products = useProductsStore(state => state.products); // ✅ Fetch all products

    return (
        <>
            {/* Main Sales Order Row */}
            <TableRow hover key={salesOrder.id}>
                <TableCell align="left">{salesOrder.createdDate}</TableCell>
                <TableCell align="left">{salesOrder.price}</TableCell>
                <TableCell align="left">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setOpen(!open)} // ✅ Expands on button click
                    >
                        {open ? "Hide Products" : "Show Products"}
                    </Button>
                </TableCell>
                <TableCell align="left">
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => onDelete(salesOrder)}
                    >
                        Delete
                    </Button>
                </TableCell>
            </TableRow>

            {/* Expandable Row - Sales Order Products */}
            {open && (
                <TableRow>
                    <TableCell colSpan={4} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={2}>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'auto',
                                        backgroundColor: theme.palette.background.paper,
                                    }}
                                >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: isDarkMode ? '#353535' : '#f5f5f5' }}>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.text.primary,
                                                        padding: '8px 12px',
                                                    }}
                                                >
                                                    Product Name
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.text.primary,
                                                        padding: '8px 12px',
                                                    }}
                                                >
                                                    Quantity
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {salesOrder.salesOrderProducts.map((product) => {
                                                const productDetails = products.find(p => p.id === product.productId);
                                                const productName = productDetails ? productDetails.name : "Unknown Product";

                                                return (
                                                    <TableRow
                                                        key={product.id}
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: isDarkMode ? '#474747' : '#fafafa',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell
                                                            sx={{
                                                                padding: '8px 12px',
                                                                color: theme.palette.text.primary,
                                                            }}
                                                        >
                                                            {productName}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                padding: '8px 12px',
                                                                color: theme.palette.text.primary,
                                                            }}
                                                        >
                                                            {product.quantity}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default SalesOrdersTableRow;