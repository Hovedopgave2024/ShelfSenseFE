import {TableRow, TableCell, Button, Box} from '@mui/material';

const SalesOrdersTableRow = ({ salesOrder, onEdit }) => (
    <TableRow hover key={salesOrder.id}>
        <TableCell align="left">{salesOrder.createdDate}</TableCell>
        <TableCell align="left">{salesOrder.productName}</TableCell>
        <TableCell align="left">{salesOrder.quantity}</TableCell>
        <TableCell align="left">{salesOrder.price}</TableCell>
        <TableCell align="left">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 110 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(salesOrder)} // Callback for editing
                >
                    Edit
                </Button>
            </Box>
        </TableCell>
    </TableRow>
);

export default SalesOrdersTableRow;