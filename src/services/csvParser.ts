import Papa from 'papaparse';
import { TribunalCase, RulingType } from '../types/case';
import { mapCsvCategoryToIOA } from './categoryMapper';

interface CsvRow {
  'Case No.': string;
  'Claim of the Applicant': string;
  'Decision': string;
  'Lessons Learned': string;
  'IOA Category': string;
  'Ruling in Favor of': string;
}

/**
 * Parses the tribunal cases CSV file and returns typed case objects
 */
export const parseTribunalCases = async (): Promise<TribunalCase[]> => {
  try {
    const response = await fetch('/data/tribunal-cases.csv');
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<CsvRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cases: TribunalCase[] = results.data
            .filter(row => row['Case No.'] && row['Case No.'].trim() !== '')
            .map(row => {
              const csvCategory = row['IOA Category'];
              const ioaCategory = mapCsvCategoryToIOA(csvCategory);

              return {
                caseNo: row['Case No.'],
                claim: row['Claim of the Applicant'],
                decision: row['Decision'],
                lessonsLearned: row['Lessons Learned'],
                csvCategory: csvCategory,
                ioaCategory: ioaCategory,
                rulingInFavorOf: normalizeRuling(row['Ruling in Favor of'])
              };
            });

          resolve(cases);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading tribunal cases:', error);
    throw error;
  }
};

/**
 * Normalizes ruling strings to standard types
 */
const normalizeRuling = (ruling: string): RulingType => {
  const normalized = ruling.trim();

  if (normalized.includes('Applicant') && !normalized.includes('Partially')) {
    return 'Applicant';
  }

  if (normalized.includes('Partially')) {
    return 'Partially Applicant';
  }

  // Default to Bank
  return 'Bank';
};
