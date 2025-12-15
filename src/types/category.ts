export interface IOACategory {
  id: number;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  subcategories: string[];
}

export interface CategoryStats {
  category: IOACategory;
  totalCases: number;
  applicantWins: number;
  bankWins: number;
  partialWins: number;
  topLessons: string[];
}
