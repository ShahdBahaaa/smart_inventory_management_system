import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => Promise<any[]>;
  onResultClick: (result: any) => void;
  renderResult: (result: any) => React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', onSearch, onResultClick, renderResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setShowDropdown(true);
      try {
        const data = await onSearch(query);
        setResults(data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <div className="input-group glass-card border-0 p-1 shadow-sm">
        <span className="input-group-text bg-transparent border-0 pe-1">
          {loading ? (
            <Loader2 size={18} className="text-primary spin-animation" />
          ) : (
            <Search size={18} className="text-primary opacity-50" />
          )}
        </span>
        <input
          type="text"
          className="form-control bg-transparent border-0 ps-2 text-inherit"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          style={{ boxShadow: 'none' }}
        />
        {query && (
          <button className="btn btn-link text-muted p-2 text-decoration-none border-0 shadow-none op-hover-100" type="button" onClick={() => setQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="dropdown-menu show w-100 glass-card border-light-subtle shadow-lg mt-2 py-2 rounded-3 overflow-hidden border" style={{ maxHeight: '350px', overflowY: 'auto', zIndex: 1050 }}>
          {loading ? (
            <div className="px-3 py-3 text-muted small fst-italic">Analyzing network nodes...</div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={index}
                className="dropdown-item py-3 px-4 border-bottom border-light-subtle text-inherit bg-hover-light-subtle transition-all"
                onClick={() => {
                  onResultClick(result);
                  setShowDropdown(false);
                  setQuery('');
                }}
              >
                {renderResult(result)}
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-muted small fst-italic">No matches identified in registry.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
