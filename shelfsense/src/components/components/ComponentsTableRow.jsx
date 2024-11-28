import {TableRow, TableCell, Button, Typography, Chip} from '@mui/material';
import { statusLabel } from '../../util/services/componentService.jsx';
import React from "react";

const ComponentsTableRow = ({ component, onEdit }) => (
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