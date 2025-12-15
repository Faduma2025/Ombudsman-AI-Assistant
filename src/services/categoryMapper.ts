import { IOACategory } from '../types/category';
import { getCategoryBySubcategory, IOA_CATEGORIES } from '../utils/constants';

/**
 * Maps a CSV category string to an IOA category
 * CSV format examples:
 * - "3.c – Compensation and Benefits"
 * - "2.k – Disciplinary and Code of Conduct Issues"
 * - "4.b – Promotion"
 */
export const mapCsvCategoryToIOA = (csvCategory: string): IOACategory => {
  // Extract the subcategory prefix (e.g., "3.c" from "3.c – Compensation and Benefits")
  const match = csvCategory.match(/^([\d]+\.[a-z])/i);

  if (match) {
    const subcategory = match[1];

    // Try to find matching IOA category by subcategory
    const category = getCategoryBySubcategory(subcategory);
    if (category) {
      return category;
    }
  }

  // Fallback: Use fuzzy matching on the description
  return fuzzyMatchCategory(csvCategory);
};

/**
 * Fuzzy matching fallback for categories that don't match subcategories
 */
const fuzzyMatchCategory = (csvCategory: string): IOACategory => {
  const lowerCategory = csvCategory.toLowerCase();

  // Check for keyword matches
  if (lowerCategory.includes('compensation') || lowerCategory.includes('benefit')) {
    return IOA_CATEGORIES[1]; // Compensation & Benefits
  }

  if (lowerCategory.includes('disciplinary') || lowerCategory.includes('code of conduct')) {
    return IOA_CATEGORIES[9]; // Values, Ethics, Standards
  }

  if (lowerCategory.includes('performance') || lowerCategory.includes('appraisal') ||
      lowerCategory.includes('grading') || lowerCategory.includes('retaliation')) {
    return IOA_CATEGORIES[2]; // Evaluative Relationships
  }

  if (lowerCategory.includes('promotion') || lowerCategory.includes('career') ||
      lowerCategory.includes('recruitment')) {
    return IOA_CATEGORIES[4]; // Career Progression
  }

  if (lowerCategory.includes('terms and conditions') || lowerCategory.includes('employment')) {
    return IOA_CATEGORIES[2]; // Evaluative Relationships
  }

  if (lowerCategory.includes('legal') || lowerCategory.includes('compliance') ||
      lowerCategory.includes('discrimination') || lowerCategory.includes('harassment')) {
    return IOA_CATEGORIES[5]; // Legal, Regulatory, Financial
  }

  if (lowerCategory.includes('safety') || lowerCategory.includes('health')) {
    return IOA_CATEGORIES[6]; // Safety, Health
  }

  if (lowerCategory.includes('service') || lowerCategory.includes('administrative')) {
    return IOA_CATEGORIES[7]; // Services/Administrative
  }

  if (lowerCategory.includes('organizational') || lowerCategory.includes('strategic') ||
      lowerCategory.includes('reorganization')) {
    return IOA_CATEGORIES[8]; // Organizational
  }

  // Default to Evaluative Relationships if no match found
  console.warn(`No category match found for: ${csvCategory}. Defaulting to Evaluative Relationships.`);
  return IOA_CATEGORIES[2];
};
