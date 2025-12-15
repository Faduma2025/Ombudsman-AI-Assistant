import { useState, useCallback, useMemo } from 'react';
import { useCases } from '../context/CasesContext';
import { CaseFilters } from '../types/case';

export const useSearch = () => {
  const { filterCases } = useCases();
  const [filters, setFilters] = useState<CaseFilters>({});

  // Apply filters and return filtered cases
  const filteredCases = useMemo(() => {
    return filterCases(filters);
  }, [filters, filterCases]);

  // Update search query
  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Update category filter
  const setCategoryFilter = useCallback((categoryId: number | undefined) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  }, []);

  // Update ruling filter
  const setRulingFilter = useCallback((ruling: CaseFilters['ruling']) => {
    setFilters(prev => ({ ...prev, ruling }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filteredCases,
    filters,
    setSearchQuery,
    setCategoryFilter,
    setRulingFilter,
    clearFilters
  };
};
