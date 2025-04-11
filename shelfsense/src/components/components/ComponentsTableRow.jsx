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
    TableCell as MuiTableCell, Paper
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { statusLabel } from '../../util/component/ComponentStatusLabel.jsx';
import { useTheme } from '@mui/material/styles';

const ComponentsTableRow = ({ component, onEdit, onAddStock }) => {
    // Expand/collapse state
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [open, setOpen] = useState(false);

    // Toggle function
    const handleToggle = () => {
        setOpen(!open);
    };

    const additionalSupplierFields = [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "manufacturerPart", label: "Manufacturer Part" },
        { key: "safetyStock", label: "Safety Stock" },
        { key: "safetyStockRop", label: "Reorder Point" },
        { key: "supplierPart", label: "Supplier Part" },
        { key: "incomingStock", label: "Incoming Stock" },
        { key: "incomingDate", label: "Incoming Date" },
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
                            component.supplier?.stockStatus
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
                            <Typography gutterBottom>
                                Supplier Details
                            </Typography>
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
                                        <MuiTableRow sx={{ backgroundColor: isDarkMode ? '#353535' : '#f5f5f5' }}>
                                            {component.supplier ? (
                                                additionalSupplierFields.map(({ label }) => (
                                                    <MuiTableCell
                                                        key={label}
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                            padding: '8px 12px',
                                                        }}
                                                    >
                                                        {label}
                                                    </MuiTableCell>
                                                ))
                                            ) : (
                                                <MuiTableCell/>
                                            )}
                                        </MuiTableRow>
                                    </TableHead>
                                <TableBody>
                                    <MuiTableRow
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: isDarkMode ? '#474747' : '#fafafa',
                                            },
                                        }}
                                    >
                                        {component.supplier ? (
                                            additionalSupplierFields.map(({ key }) => (
                                                <MuiTableCell
                                                    key={key}
                                                    sx={{
                                                        padding: '8px 12px',
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {component.supplier?.[key] || ''}
                                                </MuiTableCell>
                                            ))
                                        ) : (
                                            <MuiTableCell
                                                colSpan={1}
                                                align="center"
                                                sx={{ padding: '12px', color: theme.palette.text.secondary }}
                                            >
                                                No Supplier
                                            </MuiTableCell>
                                        )}
                                    </MuiTableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>

                            {/* Optional Fields Table */}
                            <Typography gutterBottom sx={{ mt: 2 }}>
                                Optional Fields
                            </Typography>
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
                                        <MuiTableRow sx={{ backgroundColor: isDarkMode ? '#353535' : '#f5f5f5' }}>
                                        {component.optionalComponentFields?.length > 0 ? (
                                                component.optionalComponentFields.map((field, index) => (
                                                    <MuiTableCell
                                                        key={index}
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                            padding: '8px 12px',
                                                        }}
                                                    >
                                                        {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                                    </MuiTableCell>
                                                ))
                                            ) : (
                                                <MuiTableCell/>
                                            )}
                                        </MuiTableRow>
                                    </TableHead>
                                    <TableBody>
                                        <MuiTableRow
                                            sx={{
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: isDarkMode ? '#474747' : '#fafafa',
                                                },
                                            }}
                                        >
                                            {component.optionalComponentFields?.length > 0 ? (
                                                component.optionalComponentFields.map((field, index) => (
                                                    <MuiTableCell
                                                        key={index}
                                                        sx={{
                                                            padding: '8px 12px',
                                                            color: theme.palette.text.primary,
                                                        }}
                                                    >
                                                        {field.value || ''}
                                                    </MuiTableCell>
                                                ))
                                            ) : (
                                                <MuiTableCell
                                                    colSpan={1}
                                                    align="center"
                                                    sx={{ padding: '12px', color: theme.palette.text.secondary }}
                                                >
                                                    No Additional Fields
                                                </MuiTableCell>
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