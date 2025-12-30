import { IOACategory } from '../types/category';
import { IOA_CATEGORIES } from '../utils/constants';

/**
 * Maps a CSV category string to an IOA category
 * New CSV format examples:
 * - "Medical Benefits"
 * - "Contract Conversion and Promotions"
 * - "Appointment and Position Alterations"
 */
export const mapCsvCategoryToIOA = (csvCategory: string, claim?: string): IOACategory => {
  if (!csvCategory || csvCategory.trim() === '') {
    // If no category, try to infer from claim text
    if (claim) {
      return fuzzyMatchCategory(claim);
    }
    return IOA_CATEGORIES[2]; // Default to Evaluative Relationships
  }

  // Use fuzzy matching on the category name
  return fuzzyMatchCategory(csvCategory);
};

/**
 * Fuzzy matching for new CSV category format and claim text
 */
const fuzzyMatchCategory = (text: string): IOACategory => {
  const lowerText = text.toLowerCase();

  // 1. Compensation & Benefits - salary, allowances, pension, severance
  if (lowerText.includes('compensation') || lowerText.includes('pension') ||
      lowerText.includes('salary') || lowerText.includes('allowance') ||
      lowerText.includes('severance') || lowerText.includes('plan adjust') ||
      lowerText.includes('general benefit') || lowerText.includes('financial compensation')) {
    return IOA_CATEGORIES[1];
  }

  // 6. Safety, Health, and Physical Environment - medical, disability, health
  if (lowerText.includes('medical') || lowerText.includes('health') ||
      lowerText.includes('safety') || lowerText.includes('disability') ||
      lowerText.includes('illness') || lowerText.includes('injury') ||
      lowerText.includes('long-term disability') || lowerText.includes('ltd')) {
    return IOA_CATEGORIES[6];
  }

  // 9. Values, Ethics, and Standards - misconduct, ethics, disciplinary
  if (lowerText.includes('misconduct') || lowerText.includes('disciplinary') ||
      lowerText.includes('code of conduct') || lowerText.includes('ethics') ||
      lowerText.includes('conflict of interest') || lowerText.includes('fraud')) {
    return IOA_CATEGORIES[9];
  }

  // 4. Career Progression and Development - promotion, recruitment, appointment, contract
  if (lowerText.includes('promotion') || lowerText.includes('appointment') ||
      lowerText.includes('contract conversion') || lowerText.includes('recruitment') ||
      lowerText.includes('career') || lowerText.includes('position alter') ||
      lowerText.includes('hiring') || lowerText.includes('non-selection') ||
      lowerText.includes('contract renewal') || lowerText.includes('open-ended') ||
      lowerText.includes('term contract') || lowerText.includes('fixed-term') ||
      lowerText.includes('separation') || lowerText.includes('redundancy')) {
    return IOA_CATEGORIES[4];
  }

  // 2. Evaluative Relationships - performance, appraisal, supervisor, retaliation
  if (lowerText.includes('performance') || lowerText.includes('appraisal') ||
      lowerText.includes('grading') || lowerText.includes('retaliation') ||
      lowerText.includes('supervisor') || lowerText.includes('manager') ||
      lowerText.includes('evaluation') || lowerText.includes('rating') ||
      lowerText.includes('work program') || lowerText.includes('supervision')) {
    return IOA_CATEGORIES[2];
  }

  // 3. Peer and Colleague Relationships - harassment, discrimination (peer-level)
  if (lowerText.includes('harassment') && !lowerText.includes('sexual harassment')) {
    return IOA_CATEGORIES[3];
  }

  // 5. Legal, Regulatory, Financial and Compliance - legal, discrimination, harassment
  if (lowerText.includes('legal') || lowerText.includes('compliance') ||
      lowerText.includes('discrimination') || lowerText.includes('sexual harassment') ||
      lowerText.includes('regulatory') || lowerText.includes('misrepresentation')) {
    return IOA_CATEGORIES[5];
  }

  // 7. Services/Administrative Issues - administrative, service, requisition
  if (lowerText.includes('service') || lowerText.includes('administrative') ||
      lowerText.includes('requisition') || lowerText.includes('objection') ||
      lowerText.includes('process') || lowerText.includes('procedure')) {
    return IOA_CATEGORIES[7];
  }

  // 8. Organizational, Strategic, and Mission Related - restructuring, reorganization, budget
  if (lowerText.includes('organizational') || lowerText.includes('strategic') ||
      lowerText.includes('reorganization') || lowerText.includes('mapping') ||
      lowerText.includes('restructur') || lowerText.includes('budget') ||
      lowerText.includes('resource allocation')) {
    return IOA_CATEGORIES[8];
  }

  // Default to Evaluative Relationships if no match found
  return IOA_CATEGORIES[2];
};
