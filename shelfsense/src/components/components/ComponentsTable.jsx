import { useEffect, useState } from 'react';
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
import { fetchComponents } from '../../util/services/componentService.js';
import ComponentsTableRow from './ComponentsTableRow';

const ComponentsTable = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const loadComponents = async () => {
        setLoading(true);
        try {
            const componentsData = await fetchComponents();
            if (componentsData) {
                setComponents(componentsData);
            }
        } catch (error) {
            console.error("Failed to load components:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadComponents();
        })();
    }, []);

    return (
        <Grid
            container
            spacing={2}

        >
            {loading ? (
                <>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}  aria-label="components skeleton table">
                            <TableHead>
                                <TableRow>
                                    <>
                                        {Array.from({ length: 4 }).map((_, headerIndex) => (
                                            <TableCell key={headerIndex} align={headerIndex === 0 ? "left" : "right"}>
                                                <Skeleton animation={"wave"} variant="text" width={headerIndex === 0 ? 150 : 80} height={24} />
                                            </TableCell>
                                        ))}
                                    </>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>
                                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            <>
                                                {Array.from({ length: 4 }).map((_, cellIndex) => (
                                                    <TableCell key={cellIndex} align={cellIndex === 0 ? "left" : "right"}>
                                                        <Skeleton animation={"wave"} variant="text" width={cellIndex === 0 ? "100%" : "60%"} height={24} />
                                                    </TableCell>
                                                ))}
                                            </>
                                        </TableRow>
                                    ))}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                </>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="components table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">name</TableCell>
                                    <TableCell align="left">price</TableCell>
                                    <TableCell align="left">type</TableCell>
                                    <TableCell align="left">quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>
                                    {components.length > 0 ? (
                                        components
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((data) => (
                                                <ComponentsTableRow key={data.id} component={data} />
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>No components found.</td>
                                        </tr>
                                    )}
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
            )}
        </Grid>
    );
};

export default ComponentsTable;