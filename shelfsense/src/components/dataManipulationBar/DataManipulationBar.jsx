import { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const DataControls = ({ data, onUpdate, filterOptions, sortOptions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKey, setFilterKey] = useState('');
    const [sortKey, setSortKey] = useState('');

    // Apply filters whenever search, filter, or sort state changes
    useEffect(() => {
        const applyFilters = () => {
            let filteredData = [...data];
            if (searchQuery) {
                filteredData = filteredData.filter((item) =>
                    Object.values(item).some((value) =>
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
            }
            if (filterKey) {
                filteredData = filteredData.filter((item) => item[filterKey]);
            }
            if (sortKey) {
                filteredData.sort((a, b) =>
                    a[sortKey] > b[sortKey] ? 1 : -1
                );
            }
            onUpdate(filteredData);
        };
        applyFilters();
    }, [searchQuery, filterKey, sortKey, data, onUpdate]);

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {/* Search Field */}
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
            />

            {/* Filter Dropdown */}
            <FormControl variant="outlined" style={{ flex: 1 }}>
                <InputLabel>Filter By</InputLabel>
                <Select
                    labelId="filter-by-label"
                    id="filter-by-select"
                    value={filterKey}
                    onChange={(e) => setFilterKey(e.target.value)}
                    label="Filter By"
                    variant="outlined"
                >
                    <MenuItem value="">None</MenuItem>
                    {filterOptions.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Sort Dropdown */}
            <FormControl variant="outlined" style={{ flex: 1 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    labelId="sort-by-label"
                    id="sort-by-select"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    label="Sort By"
                    variant="outlined"
                >
                    <MenuItem value="">None</MenuItem>
                    {sortOptions.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default DataControls;