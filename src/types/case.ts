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
  // New additional fields from updated CSV
  decisionDate?: string;
  applicationDate?: string;
  atJustification?: string;
  linkToJudgment?: string;
  linkToSummary?: string;
  suitableForCaseStudy?: string;
  numberOfSubmission?: string;
}

export interface CaseFilters {
  category?: number;
  ruling?: RulingType;
  searchQuery?: string;
}
