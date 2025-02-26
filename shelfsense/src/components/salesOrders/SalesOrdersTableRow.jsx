import { useState } from "react";
import {
    TableRow,
    TableCell,
    Collapse,
    Box,
    Table,
    TableBody,
    TableHead,
    Button
} from "@mui/material";
import useProductsStore from "../../stores/useProductsStore.js"; // ✅ Import product store

const SalesOrdersTableRow = ({ salesOrder, onDelete }) => {
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
                            <Box sx={{ margin: 1 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesOrder.salesOrderProducts.map((product) => {
                                            const productDetails = products.find(p => p.id === product.productId);
                                            const productName = productDetails ? productDetails.name : "Unknown Product";

                                            return (
                                                <TableRow key={product.id}>
                                                    <TableCell>{productName}</TableCell> {/* ✅ Correctly display product name */}
                                                    <TableCell>{product.quantity}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default SalesOrdersTableRow;