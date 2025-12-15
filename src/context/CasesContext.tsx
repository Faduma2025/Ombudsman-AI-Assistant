import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { TribunalCase, CaseFilters } from '../types/case';
import { CategoryStats } from '../types/category';
import { parseTribunalCases } from '../services/csvParser';
import { calculateCategoryStats } from '../utils/analytics';
import { getAllCategories } from '../utils/constants';

interface CasesContextType {
  cases: TribunalCase[];
  categoryStats: CategoryStats[];
  loading: boolean;
  error: string | null;
  searchCases: (query: string) => TribunalCase[];
  filterCases: (filters: CaseFilters) => TribunalCase[];
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const CasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<TribunalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cases on mount
  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const loadedCases = await parseTribunalCases();
        setCases(loadedCases);
        setError(null);
      } catch (err) {
        console.error('Failed to load tribunal cases:', err);
        setError('Failed to load tribunal cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  // Calculate category statistics (memoized for performance)
  const categoryStats = useMemo(() => {
    if (cases.length === 0) return [];

    const categories = getAllCategories();
    return categories.map(category => calculateCategoryStats(category, cases));
  }, [cases]);

  // Search cases by query
  const searchCases = (query: string): TribunalCase[] => {
    if (!query || query.trim() === '') {
      return cases;
    }

    const lowerQuery = query.toLowerCase();
    return cases.filter(c =>
      c.caseNo.toLowerCase().includes(lowerQuery) ||
      c.claim.toLowerCase().includes(lowerQuery) ||
      c.decision.toLowerCase().includes(lowerQuery) ||
      c.lessonsLearned.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter cases by multiple criteria
  const filterCases = (filters: CaseFilters): TribunalCase[] => {
    let filtered = cases;

    if (filters.category) {
      filtered = filtered.filter(c => c.ioaCategory.id === filters.category);
    }

    if (filters.ruling) {
      filtered = filtered.filter(c => c.rulingInFavorOf === filters.ruling);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.caseNo.toLowerCase().includes(query) ||
        c.claim.toLowerCase().includes(query) ||
        c.decision.toLowerCase().includes(query) ||
        c.lessonsLearned.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const value: CasesContextType = {
    cases,
    categoryStats,
    loading,
    error,
    searchCases,
    filterCases
  };

  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
};

export const useCases = (): CasesContextType => {
  const context = useContext(CasesContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
};
