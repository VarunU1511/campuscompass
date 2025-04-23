import React from 'react';
import styled from 'styled-components';

const SearchFilter = ({ filters, onChange }) => {
  const handleChange = (field, value) => {
    // Create a new filters object with the updated field
    const newFilters = { ...filters, [field]: value };
    
    // Call the onChange handler with the new filters
    onChange(newFilters);
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <label>Location:</label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </FilterGroup>
      
      <FilterGroup>
        <label>Listing Type:</label>
        <select
          value={filters.listingType || ''}
          onChange={(e) => handleChange('listingType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="accommodation">Accommodation</option>
          <option value="restaurant">Restaurants</option>
          <option value="shop">Shops</option>
          <option value="mess">Mess</option>
        </select>
      </FilterGroup>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #666;
  }

  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

export default SearchFilter;