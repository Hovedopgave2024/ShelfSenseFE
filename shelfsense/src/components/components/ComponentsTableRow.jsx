import {TableRow, TableCell, Button, Chip, Box} from '@mui/material';
import { statusLabel } from '../../util/services/components/statusLabel.js';

const ComponentsTableRow = ({ component, onEdit, onAddStock }) => (
    <TableRow hover key={component.id}>
        <TableCell align="left">{component.name}</TableCell>
        <TableCell align="left">{component.manufacturerPart}</TableCell>
        <TableCell align="left">{component.supplier}</TableCell>
        <TableCell align="left">{component.footprint}</TableCell>
        <TableCell align="left">{component.stock}</TableCell>
        <TableCell align="left">
            {(() => {
                const { label, icon, color } = statusLabel(component.stockStatus);
                return (
                    <Chip

                        sx={{
                            fontSize: '0.75rem',
                            borderRadius: 1,
                            width: 95,
                            height: 40,
                            backgroundColor: color,
                            color: "white",
                        }}
                        color={color}
                        label={label}
                        avatar={icon}
                    />
                );
            })()}
        </TableCell>
        <TableCell align="left">{component.safetyStock}</TableCell>
        <TableCell align="left">{component.supplierStock}</TableCell>
        <TableCell align="left">
            {(() => {
                const { label, icon, color } = statusLabel(component.supplierStockStatus);
                return (
                    <Chip

                        sx={{
                            fontSize: '0.75rem',
                            borderRadius: 1,
                            width: 95,
                            height: 40,
                            backgroundColor: color,
                            color: "white",
                        }}
                        color={color}
                        label={label}
                        avatar={icon}
                    />
                );
            })()}
        </TableCell>
        <TableCell align="left">{component.supplierIncomingStock}</TableCell>
        <TableCell align="left">{component.supplierIncomingDate}</TableCell>
        <TableCell align="left">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 110 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onAddStock(component)} // Callback for adding stock
                >
                    Add Stock
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(component)} // Callback for editing
                >
                    Edit
                </Button>
            </Box>
        </TableCell>
    </TableRow>
);

export default ComponentsTableRow;