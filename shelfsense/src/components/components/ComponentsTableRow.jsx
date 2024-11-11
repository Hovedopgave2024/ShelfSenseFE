import { TableRow, TableCell } from '@mui/material';

const ComponentsTableRow = ({ component }) => (
    <TableRow hover key={component.id}>
        <TableCell align="left">{component.name}</TableCell>
        <TableCell align="left">{component.price}</TableCell>
        <TableCell align="left">{component.type}</TableCell>
        <TableCell align="left">{component.quantity}</TableCell>
    </TableRow>
);

export default ComponentsTableRow;
