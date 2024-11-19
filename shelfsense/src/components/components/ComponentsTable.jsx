import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Stack, Typography } from '@mui/material';
import ComponentsTableRow from './ComponentsTableRow';
import useComponentsStore from "../../stores/useComponentsStore.js";

const ComponentsTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const components = useComponentsStore((state) => state.components);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Grid
            container
            spacing={2}
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {components.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="components table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="left">Price</TableCell>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>
                                {components
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data) => (
                                        <ComponentsTableRow key={data.id} component={data} />
                                    ))}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={components.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            ) : (
                <Stack
                    spacing={2}
                    sx={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                    }}
                >
                    <Typography variant="h6" color="textSecondary">
                        No components available.
                    </Typography>
                </Stack>
            )}
        </Grid>
    );
};

export default ComponentsTable;