'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Settings2 } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (params: FilterParams) => void;
  medicalIssues: string[];
}

export interface FilterParams {
  search: string;
  minAge: number | null;
  maxAge: number | null;
  medicalIssue: string;
  sortBy: 'patient_name' | 'age' | 'patient_id';
  sortOrder: 'asc' | 'desc';
}

export function SearchFilters({
  onSearch,
  medicalIssues,
}: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [medicalIssue, setMedicalIssue] = useState('');
  const [sortBy, setSortBy] = useState<'patient_name' | 'age' | 'patient_id'>('patient_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

 
  const debouncedSearch = useCallback(
    (searchValue: string, minAgeValue: number | null, maxAgeValue: number | null, medicalIssueValue: string, sortByValue: typeof sortBy, sortOrderValue: typeof sortOrder) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onSearch({
          search: searchValue,
          minAge: minAgeValue,
          maxAge: maxAgeValue,
          medicalIssue: medicalIssueValue,
          sortBy: sortByValue,
          sortOrder: sortOrderValue,
        });
      }, 500); 
    },
    [onSearch]
  );

  const handleSearch = useCallback(() => {
    debouncedSearch(search, minAge, maxAge, medicalIssue, sortBy, sortOrder);
  }, [search, minAge, maxAge, medicalIssue, sortBy, sortOrder, debouncedSearch]);

  const handleClear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearch('');
    setMinAge(null);
    setMaxAge(null);
    setMedicalIssue('');
    setSortBy('patient_name');
    setSortOrder('asc');
    onSearch({
      search: '',
      minAge: null,
      maxAge: null,
      medicalIssue: '',
      sortBy: 'patient_name',
      sortOrder: 'asc',
    });
  }, [onSearch]);

  const hasActiveFilters = useMemo(() => {
    return (
      search ||
      minAge !== null ||
      maxAge !== null ||
      medicalIssue ||
      sortBy !== 'patient_name' ||
      sortOrder !== 'asc'
    );
  }, [search, minAge, maxAge, medicalIssue, sortBy, sortOrder]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (minAge !== null) count++;
    if (maxAge !== null) count++;
    if (medicalIssue) count++;
    if (sortBy !== 'patient_name') count++;
    if (sortOrder !== 'asc') count++;
    return count;
  }, [search, minAge, maxAge, medicalIssue, sortBy, sortOrder]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
    
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value, minAge, maxAge, medicalIssue, sortBy, sortOrder);
          }}
          className="w-full pl-12 border-gray-300 bg-white"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Settings2 className="h-5 w-5" />
        </button>
      </div>


      <div className="flex flex-wrap gap-2 items-center w-full">
        {hasActiveFilters && (
          <>
            <button
              onClick={handleClear}
              className="text-sm text-blue-600 hover:underline mr-2"
            >
              Clear all filters
            </button>
            {search && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm">
                <span>Search: {search}</span>
                <button
                  onClick={() => {
                    setSearch('');
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {minAge !== null && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm">
                <span>Age ≥ {minAge}</span>
                <button
                  onClick={() => {
                    setMinAge(null);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {maxAge !== null && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm">
                <span>Age ≤ {maxAge}</span>
                <button
                  onClick={() => {
                    setMaxAge(null);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {medicalIssue && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm">
                <span>Issue: {medicalIssue}</span>
                <button
                  onClick={() => {
                    setMedicalIssue('');
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {(sortBy !== 'patient_name' || sortOrder !== 'asc') && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm">
                <span>Sort: {sortBy} {sortOrder}</span>
                <button
                  onClick={() => {
                    setSortBy('patient_name');
                    setSortOrder('asc');
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
