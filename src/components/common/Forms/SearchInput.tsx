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
      <div className="input-group glass-card border-0 p-1">
        <span className="input-group-text bg-transparent border-0">
          {loading ? <Loader2 size={18} className="text-info animate-spin" /> : <Search size={18} className="text-info opacity-75" />}
        </span>
        <input
          type="text"
          className="form-control bg-transparent border-0 text-dark ps-0"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
        />
        {query && (
          <button className="btn btn-link text-info opacity-50 hover-opacity-100 border-0" type="button" onClick={() => setQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="dropdown-menu show w-100 glass-card border-secondary border-opacity-10 shadow-lg mt-1 py-2 rounded-3 overflow-hidden" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {loading ? (
            <div className="px-3 py-2 text-muted small">Analyzing registry...</div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={index}
                className="dropdown-item py-2 px-3 border-bottom border-secondary border-opacity-5 last-border-0 text-dark hover-bg-white"
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
            <div className="px-3 py-2 text-muted small">No matching nodes found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
