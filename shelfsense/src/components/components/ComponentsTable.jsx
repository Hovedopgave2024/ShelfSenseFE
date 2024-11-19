import { useState } from 'react';
import Grid from '@mui/material/Grid2';
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
// import useComponentsStore from "../../stores/useComponentsStore.js";
import {Typography} from "@mui/material";

const ComponentsTable = () => {
    const components = []  // useComponentsStore((state) => state.components);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

        >
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
                            {components && components.length > 0 ? (
                                components
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data) => (
                                        <ComponentsTableRow key={data.id} component={data} />
                                    ))
                            ) : (
                                <TableRow>
                                    <>
                                        {[...Array(4)].map((_, index) => (
                                            <TableCell key={index}>
                                                <Skeleton variant="rectangular" height={25} />
                                            </TableCell>
                                        ))}
                                    </>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {(!components || components.length === 0) && (
                    <Typography align="center"> No components available </Typography>
                )}
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
        </Grid>
    );
};

export default ComponentsTable;