import { useState } from 'react';
import {
    TableRow,
    TableCell,
    Button,
    Chip,
    Box,
    Collapse,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    TableRow as MuiTableRow,
    TableCell as MuiTableCell
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { statusLabel } from '../../util/component/ComponentStatusLabel.jsx';

const ComponentsTableRow = ({ component, onEdit, onAddStock }) => {
    // Expand/collapse state
    const [open, setOpen] = useState(false);

    // Toggle function
    const handleToggle = () => {
        setOpen(!open);
    };

    const additionalComponentFields = [
        "price",
        "safetyStockRop",
        ""
    ]
    const additionalSupplierFields = [
        "manufacturer",
        "manufacturerPart",
        "safetyStock",
        "safetyStockRop",
        "supplierPart",
        "incomingStock",
        "incomingDate"
    ];

    return (
        <>
            {/* Main Row */}
            <TableRow hover key={component.id}>

                {/* Expand/collapse button */}
                <TableCell>
                    <IconButton size="small" onClick={handleToggle}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                <TableCell align="left">{component.name}</TableCell>
                <TableCell align="left">{component.price}</TableCell>

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
                <TableCell align="left">{component.stock}</TableCell>
                <TableCell align="left">{component.safetyStock}</TableCell>
                <TableCell align="left">{component.safetyStockRop}</TableCell>
                <TableCell align="left">{component.supplier?.name ?? "No Supplier"}</TableCell>
                <TableCell align="left">
                    {(() => {
                        const { label, icon, color } = statusLabel(
                            component.supplier.stockStatus
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
                <TableCell align="left">{component.supplier?.stock ?? 0}</TableCell>
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

            {/* Expanded Row - Supplier & Optional Fields */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            {/* Supplier Fields Table */}
                            <Typography variant="h6" gutterBottom>
                                Supplier Details
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <MuiTableRow>
                                            {component.supplier
                                                ? additionalSupplierFields.map((key) => (
                                                    <MuiTableCell key={key}>{key}</MuiTableCell>
                                                ))
                                                : <MuiTableCell></MuiTableCell>
                                            }
                                        </MuiTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {component.supplier ? (
                                            <MuiTableRow>
                                                {additionalSupplierFields.map((key, index) => (
                                                    <MuiTableCell key={index}>{component.supplier?.[key] || ''}</MuiTableCell>
                                                ))}
                                            </MuiTableRow>
                                        ) : (
                                            <MuiTableRow>
                                                <MuiTableCell colSpan={additionalSupplierFields.length || 1} align="center">
                                                    No Supplier
                                                </MuiTableCell>
                                            </MuiTableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Optional Fields Table */}
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Optional Fields
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <MuiTableRow>
                                            {component.optionalComponentFields?.length > 0 ? (
                                                component.optionalComponentFields.map((field, index) => (
                                                    <MuiTableCell key={index}>{field.name}</MuiTableCell>
                                                ))
                                            ) : (
                                                <MuiTableCell></MuiTableCell>
                                            )}
                                        </MuiTableRow>
                                    </TableHead>
                                    <TableBody>
                                        <MuiTableRow>
                                            {component.optionalComponentFields?.length > 0 ? (
                                                component.optionalComponentFields.map((field, index) => (
                                                    <MuiTableCell key={index}>{field.value || ''}</MuiTableCell>
                                                ))
                                            ) : (
                                                <MuiTableCell colSpan={1} align="center">No Additional Fields</MuiTableCell>
                                            )}
                                        </MuiTableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ComponentsTableRow;