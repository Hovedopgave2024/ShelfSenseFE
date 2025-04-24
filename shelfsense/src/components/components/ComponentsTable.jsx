import {useEffect, useState} from 'react';
import ComponentsTableRow from './ComponentsTableRow';
import useComponentsStore from "../../stores/useComponentsStore.js";
import { Typography, Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination} from "@mui/material";
import DataManipulationBar from '../dataManipulationBar/DataManipulationBar.jsx';
import { useTheme } from "@mui/material";


const ComponentsTable = ({ onEdit, onAddStock, productComponentIds }) => {
    const storeComponents = useComponentsStore((state) => state.components);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [components, setComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const stockStatuses = [...new Set(components.map(component => component.stockStatus))];
    const columnTitles = ["Expand", "Name", "Price", "Stock Status", "Stock", "Safety Stock", "Reorder Point", "Supplier", "Supplier Stock Status", "Supplier Stock", "Actions"];
    const componentSortingOptions = ["Name", "Price", "Stock Status", "Stock", "Safety Stock", "Reorder Point"];
    const theme = useTheme();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Handler to remove filters and show all components again
    const handleRemoveFilter = () => {
        setFilteredComponents(storeComponents);
        setComponents(storeComponents);
    };

    useEffect(() => {
        if (productComponentIds && productComponentIds.length > 0) {
            setComponents(storeComponents.filter((c) => productComponentIds.includes(c.id)));
        } else if (filteredComponents && filteredComponents.length > 0) {
            setComponents(storeComponents.filter((fc) =>
                filteredComponents.some((sc) => sc.id === fc.id)));
        } else {
            setComponents(storeComponents);
        }
    }, [storeComponents]);

    useEffect(() => {
         setFilteredComponents(components);
    }, [components]);



    return (
        <Box>
            <DataManipulationBar
                data={components}
                onUpdate={setFilteredComponents}
                filterOptions={[
                    { key: 'stockStatus', label: 'Stock Status', values: stockStatuses },
                ]}
                initialSortKey={'name'}
                sortOptions={componentSortingOptions.map((title) => ({
                    key: title.toLowerCase(),
                    label: title,
                }))}
                searchOptions={[
                    { key: 'name', label: 'Name' },
                ]}
                onClick={handleRemoveFilter}
            />
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