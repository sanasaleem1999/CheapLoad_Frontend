import React, { useState } from 'react';
import { Box, Paper, TextField, MenuItem, Button, Typography, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { get_posts } from '../../Store/postReducer';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }).map((_, i) => String(currentYear - i));

const trailerTypes = ['OPEN', 'CLOSED', 'FLATBED', 'ENCLOSED'];
const states = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const postsState = useSelector((s) => s.posts || {});

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    trailerType: '',
    make: '',
    model: '',
    state: '',
    year: '',
  });

  const [searched, setSearched] = useState(false);

  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Build params object from updated filters (only include non-empty values)
    const params = Object.keys(updatedFilters).reduce((acc, key) => {
      if (updatedFilters[key]) acc[key] = updatedFilters[key];
      return acc;
    }, {});

    // Dispatch API call immediately when filter changes
    dispatch(get_posts(params));
    setSearched(true);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((v) => v && v !== "").length;
  };

  const clearFilters = () => {
    setFilters({ from: '', to: '', trailerType: '', make: '', model: '', state: '', year: '' });
    dispatch(get_posts()); // Fetch all posts when filters are cleared
    setSearched(false);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: 280,
        p: 3,
        borderRadius: 2,
        height: 'fit-content',
        position: 'fixed',
        left: 16,
        top: 100,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 120px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FilterListIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {getActiveFilterCount() > 0 && (
          <Chip
            label={getActiveFilterCount()}
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="From (Year)"
          select
          size="small"
          fullWidth
          value={filters.from}
          onChange={(e) => handleFilterChange('from', e.target.value)}
        >
          <MenuItem value="">
            <em>Select Year</em>
          </MenuItem>
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="To (Year)"
          select
          size="small"
          fullWidth
          value={filters.to}
          onChange={(e) => handleFilterChange('to', e.target.value)}
        >
          <MenuItem value="">
            <em>Select Year</em>
          </MenuItem>
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Trailer Type"
          select
          size="small"
          fullWidth
          value={filters.trailerType}
          onChange={(e) => handleFilterChange('trailerType', e.target.value)}
        >
          <MenuItem value="">
            <em>All Types</em>
          </MenuItem>
          {trailerTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Make"
          size="small"
          fullWidth
          placeholder="e.g., Toyota"
          value={filters.make}
          onChange={(e) => handleFilterChange('make', e.target.value)}
        />

        <TextField
          label="Model"
          size="small"
          fullWidth
          placeholder="e.g., Camry SE"
          value={filters.model}
          onChange={(e) => handleFilterChange('model', e.target.value)}
        />

        <TextField
          label="State"
          select
          size="small"
          fullWidth
          value={filters.state}
          onChange={(e) => handleFilterChange('state', e.target.value)}
        >
          <MenuItem value="">
            <em>All States</em>
          </MenuItem>
          {states.map(state => (
            <MenuItem key={state} value={state}>{state}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Year"
          select
          size="small"
          fullWidth
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
        >
          <MenuItem value="">
            <em>All Years</em>
          </MenuItem>
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
          disabled={getActiveFilterCount() === 0}
          sx={{ mt: 1 }}
        >
          Clear All
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterSidebar;
