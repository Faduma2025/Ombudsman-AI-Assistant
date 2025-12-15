import { useMemo } from 'react';
import { useCases } from '../context/CasesContext';
import { CategoryStats } from '../types/category';

export const useCategories = () => {
  const { categoryStats, loading } = useCases();

  // Sort categories by number of cases (descending)
  const sortedCategories = useMemo(() => {
    return [...categoryStats].sort((a, b) => b.totalCases - a.totalCases);
  }, [categoryStats]);

  // Get a specific category's stats by ID
  const getCategoryStats = (categoryId: number): CategoryStats | undefined => {
    return categoryStats.find(stat => stat.category.id === categoryId);
  };

  return {
    categories: categoryStats,
    sortedCategories,
    getCategoryStats,
    loading
  };
};
