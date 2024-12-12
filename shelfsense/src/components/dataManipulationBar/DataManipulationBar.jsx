import { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";
import toCamelCase from "../../util/misc/toCamcelCase.js";

const DataControls = ({ data, onUpdate, filterOptions, sortOptions, searchOptions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [filterKey, setFilterKey] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // Transform sort options to camelCase keys
    const transformedSortOptions = sortOptions.map(option => ({
        key: toCamelCase(option.label), // Convert the label to a camelCase key
        label: option.label
    }));

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyChange = (e) => {
        setSearchKey(e.target.value);
    };

    const handleFilterKeyChange = (e) => {
        setFilterKey(e.target.value);
        setFilterValue(''); // Reset filter value when the filter key changes
    };

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortKey(e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    useEffect(() => {
        if (!sortKey && transformedSortOptions?.length > 0) {
            setSortKey(transformedSortOptions[0].key);
        }
    }, [transformedSortOptions, sortKey]);

    useEffect(() => {
        const applyFilters = () => {
            let filteredData = [...data];

            if (searchQuery && searchKey) {
                filteredData = filteredData.filter((item) =>
                    String(item[searchKey]).toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (filterKey && filterValue) {
                filteredData = filteredData.filter((item) =>
                    String(item[filterKey]) === String(filterValue)
                );
            }

            if (sortKey) {
                filteredData.sort((a, b) => {
                    if (sortOrder === 'asc') {
                        return a[sortKey] > b[sortKey] ? 1 : -1;
                    } else {
                        return a[sortKey] < b[sortKey] ? 1 : -1;
                    }
                });
            }

            onUpdate(filteredData);
        };

        applyFilters();
    }, [searchQuery, searchKey, filterKey, filterValue, sortKey, sortOrder, data, onUpdate]);

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Search By</InputLabel>
                        <Select value={searchKey} onChange={handleSearchKeyChange} label="Search By" variant="outlined">
                            <MenuItem value="">None</MenuItem>
                            {searchOptions.map((option) => (
                                <MenuItem key={option.key} value={option.key}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={4} lg={3}>
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        size="small"
                    />
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 110 }}>
                        <InputLabel>Filter By</InputLabel>
                        <Select value={filterKey} onChange={handleFilterKeyChange} label="Filter By" variant="outlined">
                            <MenuItem value="">None</MenuItem>
                            {filterOptions.map((option) => (
                                <MenuItem key={option.key} value={option.key}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {filterKey && (
                    <Grid xs={12} sm={6} md={4} lg={3}>
                        <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 130 }}>
                            <InputLabel>Filter Value</InputLabel>
                            <Select value={filterValue} onChange={handleFilterValueChange} label="Filter Value" variant="outlined">
                                <MenuItem value="">None</MenuItem>
                                {filterOptions
                                    .find((option) => option.key === filterKey)
                                    ?.values.map((value) => (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}

                <Grid xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortKey} onChange={handleSortChange} label="Sort By" variant="outlined">
                            {transformedSortOptions.map((option) => (
                                <MenuItem key={option.key} value={option.key}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid xs={12} sm={6} md={4} lg={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Order</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange} label="Order" variant="outlined">
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DataControls;
