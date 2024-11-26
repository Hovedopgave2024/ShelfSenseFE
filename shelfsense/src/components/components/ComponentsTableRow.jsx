import { TableRow, TableCell, Button } from '@mui/material';

const ComponentsTableRow = ({ component, onEdit }) => (
    <TableRow hover key={component.id}>
        <TableCell align="left">{component.name}</TableCell>
        <TableCell align="left">{component.manufacturerPart}</TableCell>
        <TableCell align="left">{component.price}</TableCell>
        <TableCell align="left">{component.type}</TableCell>
        <TableCell align="left">{component.stock}</TableCell>
            <TableCell align="left">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onEdit(component)} // Callback for editing
                    >
                            Edit
                    </Button>
            </TableCell>
    </TableRow>
);

export default ComponentsTableRow;
