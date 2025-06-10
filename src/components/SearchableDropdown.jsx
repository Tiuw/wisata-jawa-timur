import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  label,
  searchKey = 'name',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option display text
  const selectedOption = options.find(
    (option) => option.id === parseInt(value)
  );
  const displayText = selectedOption ? selectedOption[searchKey] : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.id.toString());
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>

      <div
        className={`relative w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed border-gray-300'
            : isOpen
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${
              displayText ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {displayText || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder={`Cari ${label.toLowerCase()}...`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm ${
                    option.id === parseInt(value)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option[searchKey]}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Tidak ada hasil ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;