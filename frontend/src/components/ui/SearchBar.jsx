import React, { useState } from 'react';
import Icon from '../AppIcon';
import Input from './Input';

const SearchBar = ({ 
  placeholder = 'Search FAQs...', 
  onSearch,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          className="pl-12 pr-12"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-default"
            aria-label="Clear search"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;