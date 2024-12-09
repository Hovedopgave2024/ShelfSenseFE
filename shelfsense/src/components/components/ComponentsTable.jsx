import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import ComponentsTableRow from './ComponentsTableRow';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { IconButton, Tooltip, Typography} from "@mui/material";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DataManipulationBar from '../dataManipulationBar/DataManipulationBar.jsx';
import { useTheme } from "@mui/material";


const ComponentsTable = ({ onEdit, onAddStock, currentComponentIds }) => {
    const components = useComponentsStore((state) => state.components);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const types = [...new Set(components.map(component => component.type))];
    const manufacturers = [...new Set(components.map(component => component.manufacturer))];
    const suppliers = [...new Set(components.map(component => component.supplier))];
    const columnTitles = ["Name", "Manufacturer Part", "Supplier", "Footprint", "Stock", "Stock Status", "Safety Stock", "Supplier Stock", "Supplier Stock Status", "Supplier Incoming Stock", "Supplier Incoming Date", "Actions"];
    const theme = useTheme();
    const [localCurrentComponentIds, setLocalCurrentComponentIds] = useState(currentComponentIds);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Handler to remove filters and show all components again
    const handleRemoveFilter = () => {
        // Clear the locally stored IDs
        setLocalCurrentComponentIds([]);
        setFilteredComponents(components);
    };


    useEffect(() => {
        if (localCurrentComponentIds.length > 0) {

            setFilteredComponents(components.filter((c) => localCurrentComponentIds.includes(c.id)));
        } else {
            setFilteredComponents(components);
        }
    }, [localCurrentComponentIds, components]);



    return (
        <Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px', // or 'flex-start', depending on how you want the layout
            }}
            >
                <DataManipulationBar
                    data={filteredComponents}
                    onUpdate={setFilteredComponents}
                    filterOptions={[
                        { key: 'type', label: 'Type', values: types },
                        { key: 'manufacturer', label: 'Manufacturer', values: manufacturers },
                        { key: 'supplier', label: 'Supplier', values: suppliers },
                    ]}
                    sortOptions={columnTitles.map((title) => ({
                        key: title.toLowerCase(),
                        label: title,
                    }))}

                />

                <Tooltip sx={{
                    pb: 3,
                    color: theme.palette.text.primary
                }}
                         title="Remove all filters" arrow>
                    <IconButton onClick={handleRemoveFilter} color="secondary">
                        < FilterAltOffIcon />
                    </IconButton>
                </Tooltip>
        </Box>

            <Paper
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxHeight: { xs: '35vh', sm: '45vh', md: '55vh', lg: '65vh', xl: '75vh' },
                    overflow: 'auto',
                }}
            >
                <TableContainer>
                    <Table stickyHeader aria-label="components table">
                        <TableHead>
                            <TableRow>
                                {columnTitles.map((title, index) => (
                                    <TableCell
                                        align="left"
                                        key={index}
                                        sx={{
                                            backgroundColor: theme.palette.background.paper, // Dynamic color based on theme
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        {title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredComponents && filteredComponents.length > 0 ? (
                                filteredComponents
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data) => (
                                        <ComponentsTableRow
                                            key={data.id}
                                            component={data}
                                            onEdit={onEdit}
                                            onAddStock={onAddStock}
                                        />
                                    ))
                            ) : (
                                <TableRow>
                                    {[...Array(columnTitles.length)].map((_, index) => (
                                        <TableCell key={index}>
                                            <Skeleton animation="wave" variant="rectangular" height={25} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {(!filteredComponents || filteredComponents.length === 0) && (
                    <Typography align="center">No components available</Typography>
                )}
            </Paper>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Align pagination to the right
                    mt: 2, // Add spacing above pagination
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={filteredComponents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

export default ComponentsTable;