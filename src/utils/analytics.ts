import { TribunalCase } from '../types/case';
import { CategoryStats, IOACategory } from '../types/category';

/**
 * Calculate statistics for a specific category
 */
export const calculateCategoryStats = (
  category: IOACategory,
  cases: TribunalCase[]
): CategoryStats => {
  const categoryCases = cases.filter(c => c.ioaCategory.id === category.id);

  const applicantWins = categoryCases.filter(c => c.rulingInFavorOf === 'Applicant').length;
  const bankWins = categoryCases.filter(c => c.rulingInFavorOf === 'Bank').length;
  const partialWins = categoryCases.filter(c => c.rulingInFavorOf === 'Partially Applicant').length;

  // Extract top 5 unique lessons learned
  const allLessons = categoryCases.map(c => c.lessonsLearned);
  const uniqueLessons = [...new Set(allLessons)];
  const topLessons = uniqueLessons.slice(0, 5);

  return {
    category,
    totalCases: categoryCases.length,
    applicantWins,
    bankWins,
    partialWins,
    topLessons
  };
};

/**
 * Calculate overall statistics across all cases
 */
export const calculateOverallStats = (cases: TribunalCase[]) => {
  const totalCases = cases.length;
  const applicantWins = cases.filter(c => c.rulingInFavorOf === 'Applicant').length;
  const bankWins = cases.filter(c => c.rulingInFavorOf === 'Bank').length;
  const partialWins = cases.filter(c => c.rulingInFavorOf === 'Partially Applicant').length;

  return {
    totalCases,
    applicantWins,
    bankWins,
    partialWins,
    applicantWinRate: totalCases > 0 ? ((applicantWins + partialWins) / totalCases) * 100 : 0,
    bankWinRate: totalCases > 0 ? (bankWins / totalCases) * 100 : 0
  };
};

/**
 * Search cases by query string
 */
export const searchCases = (cases: TribunalCase[], query: string): TribunalCase[] => {
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

/**
 * Filter cases by category
 */
export const filterByCategory = (cases: TribunalCase[], categoryId: number): TribunalCase[] => {
  return cases.filter(c => c.ioaCategory.id === categoryId);
};
