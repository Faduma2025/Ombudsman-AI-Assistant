import { IOACategory } from '../types/category';
import { IOA_CATEGORIES } from '../utils/constants';

/**
 * Maps a CSV category string to an IOA category
 * New CSV format examples:
 * - "Medical Benefits"
 * - "Contract Conversion and Promotions"
 * - "Appointment and Position Alterations"
 */
export const mapCsvCategoryToIOA = (csvCategory: string): IOACategory => {
  if (!csvCategory) {
    return IOA_CATEGORIES[2]; // Default to Evaluative Relationships
  }

  // Use fuzzy matching on the category name
  return fuzzyMatchCategory(csvCategory);
};

/**
 * Fuzzy matching for new CSV category format
 */
const fuzzyMatchCategory = (csvCategory: string): IOACategory => {
  const lowerCategory = csvCategory.toLowerCase();

  // 1. Compensation & Benefits
  if (lowerCategory.includes('compensation') || lowerCategory.includes('pension') ||
      lowerCategory.includes('plan adjust') || lowerCategory.includes('general benefit')) {
    return IOA_CATEGORIES[1];
  }

  // 6. Safety, Health, and Physical Environment (check before general "benefits")
  if (lowerCategory.includes('medical') || lowerCategory.includes('health') ||
      lowerCategory.includes('safety') || lowerCategory.includes('disability')) {
    return IOA_CATEGORIES[6];
  }

  // 9. Values, Ethics, and Standards
  if (lowerCategory.includes('misconduct') || lowerCategory.includes('disciplinary') ||
      lowerCategory.includes('code of conduct') || lowerCategory.includes('ethics')) {
    return IOA_CATEGORIES[9];
  }

  // 4. Career Progression and Development
  if (lowerCategory.includes('promotion') || lowerCategory.includes('appointment') ||
      lowerCategory.includes('contract conversion') || lowerCategory.includes('recruitment') ||
      lowerCategory.includes('career') || lowerCategory.includes('position alter')) {
    return IOA_CATEGORIES[4];
  }

  // 2. Evaluative Relationships
  if (lowerCategory.includes('performance') || lowerCategory.includes('appraisal') ||
      lowerCategory.includes('grading') || lowerCategory.includes('retaliation') ||
      lowerCategory.includes('terms and conditions') || lowerCategory.includes('employment')) {
    return IOA_CATEGORIES[2];
  }

  // 5. Legal, Regulatory, Financial and Compliance
  if (lowerCategory.includes('legal') || lowerCategory.includes('compliance') ||
      lowerCategory.includes('discrimination') || lowerCategory.includes('harassment') ||
      lowerCategory.includes('fraud')) {
    return IOA_CATEGORIES[5];
  }

  // 7. Services/Administrative Issues
  if (lowerCategory.includes('service') || lowerCategory.includes('administrative') ||
      lowerCategory.includes('requisition') || lowerCategory.includes('objection')) {
    return IOA_CATEGORIES[7];
  }

  // 8. Organizational, Strategic, and Mission Related
  if (lowerCategory.includes('organizational') || lowerCategory.includes('strategic') ||
      lowerCategory.includes('reorganization') || lowerCategory.includes('mapping')) {
    return IOA_CATEGORIES[8];
  }

  // Default to Evaluative Relationships if no match found
  console.warn(`No category match found for: ${csvCategory}. Defaulting to Evaluative Relationships.`);
  return IOA_CATEGORIES[2];
};
