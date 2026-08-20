import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  showSearch?: boolean; // Auto-enabled when options > 7
  className?: string;
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  showSearch: forceShowSearch = false,
  className = ''
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showSearch = forceShowSearch || options.length > 7;

  // Filter options based on search
  const filteredOptions = searchQuery.trim()
    ? options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const displayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === options.length) {
      return 'All';
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const allSelected = selectedValues.length === options.length;
  const someSelected = selectedValues.length > 0 && selectedValues.length < options.length;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-left flex items-center justify-between cursor-pointer hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900"
      >
        <span className={selectedValues.length === 0 ? 'text-neutral-400' : 'text-neutral-900'}>
          {displayText()}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search */}
          {showSearch && (
            <div className="p-2 border-b border-neutral-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Select All */}
          <div className="border-b border-neutral-100">
            <label
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
            >
              <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                allSelected
                  ? 'bg-emerald-500 border-emerald-500'
                  : someSelected
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-neutral-300'
              }`}>
                {allSelected && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                {someSelected && !allSelected && (
                  <div className="w-2 h-0.5 bg-[#FFFFFF]" />
                )}
              </div>
              <span className="text-sm font-medium text-neutral-900">Select All</span>
            </label>
          </div>

          {/* Options List */}
          <div className="max-h-[240px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-neutral-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(option);
                    }}
                  >
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                    </div>
                    <span className="text-sm text-neutral-700">{option}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}