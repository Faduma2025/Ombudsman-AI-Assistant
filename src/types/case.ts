import { IOACategory } from './category';

export type RulingType = 'Applicant' | 'Bank' | 'Partially Applicant';

export interface TribunalCase {
  caseNo: string;
  claim: string;
  decision: string;
  lessonsLearned: string;
  csvCategory: string; // Original category from CSV
  ioaCategory: IOACategory; // Mapped IOA category
  rulingInFavorOf: RulingType;
}

export interface CaseFilters {
  category?: number;
  ruling?: RulingType;
  searchQuery?: string;
}
