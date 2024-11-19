import { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const DataControls = ({ data, onUpdate, filterOptions, sortOptions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKey, setFilterKey] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
        const applyFilters = () => {
            let filteredData = [...data];

            // Apply search
            if (searchQuery) {
                filteredData = filteredData.filter((item) =>
                    String(item.name).toLowerCase().includes(searchQuery.toLowerCase()) // Example: searching only by "name"
                );
            }

            // Apply single filter
            if (filterKey && filterValue) {
                filteredData = filteredData.filter((item) =>
                    String(item[filterKey]) === String(filterValue)
                );
            }

            // Apply sorting
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
    }, [searchQuery, filterKey, filterValue, sortKey, sortOrder, data, onUpdate]);

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {/* Search Field */}
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                style={{ flex: 1 }}
            />

            {/* Filter Dropdown */}
            <FormControl variant="outlined" style={{ flex: 1 }}>
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

            {filterKey && (
                <FormControl variant="outlined" style={{ flex: 1 }}>
                    <InputLabel>Filter Value</InputLabel>
                    <Select
                        value={filterValue}
                        onChange={handleFilterValueChange}
                        label="Filter Value"
                        variant="outlined"
                    >
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
            )}

            {/* Sort Dropdown */}
            <FormControl variant="outlined" style={{ flex: 1 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortKey} onChange={handleSortChange} label="Sort By" variant="outlined">
                    <MenuItem value="">None</MenuItem>
                    {sortOptions.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ flex: 1 }}>
                <InputLabel>Order</InputLabel>
                <Select value={sortOrder} onChange={handleSortOrderChange} label="Order" variant="outlined">
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default DataControls;