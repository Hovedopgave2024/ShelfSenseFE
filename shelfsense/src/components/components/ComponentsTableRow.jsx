import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    Button,
    Chip,
    Box,
    Collapse,
    IconButton, Typography
} from '@mui/material';
import { statusLabel } from '../../util/component/ComponentStatusLabel.jsx';

const ComponentsTableRow = ({ component, onEdit, onAddStock }) => {
    // 1) Add local state for collapse
    const [open, setOpen] = useState(false);

    // Helper to toggle
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            {/* This is your main row */}
            <TableRow hover key={component.id} onClick={handleToggle}>

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
                                    color: 'white',
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
                        const { label, icon, color } = statusLabel(
                            component.supplierStockStatus
                        );
                        return (
                            <Chip
                                sx={{
                                    fontSize: '0.75rem',
                                    borderRadius: 1,
                                    width: 95,
                                    height: 40,
                                    backgroundColor: color,
                                    color: 'white',
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
                        <Button variant="outlined" size="small" onClick={(e) => {e.stopPropagation();onAddStock(component);}}>
                            Add Stock
                        </Button>
                        <Button variant="outlined" size="small" onClick={(e) => {e.stopPropagation(); onEdit(component)}}>
                            Edit
                        </Button>
                    </Box>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={13}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            <Typography variant="h6" gutterBottom>
                                Extra Details
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Name:</strong> {component.name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Designator:</strong> {component.designator}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Price:</strong> {component.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Manufacturer:</strong> {component.manufacturer}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Supplier:</strong> {component.supplier}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Supplier Part:</strong> {component.supplierPart}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Type:</strong> {component.type}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Safety Stock ROP:</strong> {component.safetyStockRop}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Supplier Safety Stock ROP:</strong> {component.supplierSafetyStockRop}
                            </Typography>
                        </Box>
                    </Collapse>

                </TableCell>
            </TableRow>
        </>
    );
};

export default ComponentsTableRow;
