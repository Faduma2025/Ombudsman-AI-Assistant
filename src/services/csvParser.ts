import Papa from 'papaparse';
import { TribunalCase, RulingType } from '../types/case';
import { mapCsvCategoryToIOA } from './categoryMapper';

interface CsvRow {
  'Case #': string;
  'Name ': string;
  'The Claim': string;
  'Decsions': string;
  'Lessons learned': string;
  'Category': string;
  'Who Lost?': string;
  'Decision Date ': string;
  'Date of Final Decsion ': string;
  'AT Justification': string;
  'Link to Judgment/Order': string;
  'Link to Summary': string;
  'Suitable for Case Study?': string;
  'Number of submission ': string;
}

/**
 * Cleans up text by replacing encoding issues with proper characters
 */
const cleanText = (text: string): string => {
  if (!text) return text;
  return text
    .replace(/�/g, "'")  // Replace � with apostrophe
    .replace(/â€™/g, "'")  // Replace smart apostrophe encoding issue
    .replace(/â€"/g, "–")  // Replace en-dash encoding issue
    .replace(/â€"/g, "—")  // Replace em-dash encoding issue
    .replace(/â€œ/g, '"')  // Replace opening quote encoding issue
    .replace(/â€/g, '"')   // Replace closing quote encoding issue
    .trim();
};

/**
 * Parses the tribunal cases CSV file and returns typed case objects
 */
export const parseTribunalCases = async (): Promise<TribunalCase[]> => {
  try {
    const response = await fetch('/data/tribunal-cases.csv');
    let csvText = await response.text();

    // Remove BOM if present
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.substring(1);
    }

    // Split into lines and remove the first metadata row
    const lines = csvText.split('\n');
    if (lines.length > 0 && lines[0].includes('Cases')) {
      lines.shift(); // Remove metadata row
    }
    csvText = lines.join('\n');

    return new Promise((resolve, reject) => {
      Papa.parse<CsvRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cases: TribunalCase[] = results.data
            .filter(row => row['Case #'] && row['Case #'].trim() !== '')
            .map(row => {
              const csvCategory = row['Category'] || '';
              const claim = cleanText(row['The Claim']);
              const ioaCategory = mapCsvCategoryToIOA(csvCategory, claim);

              return {
                caseNo: cleanText(row['Case #']),
                caseName: cleanText(row['Name ']),
                claim: claim,
                decision: cleanText(row['Decsions']),
                lessonsLearned: cleanText(row['Lessons learned']),
                csvCategory: csvCategory,
                ioaCategory: ioaCategory,
                rulingInFavorOf: normalizeRulingFromWhoLost(row['Who Lost?']),
                decisionDate: cleanText(row['Decision Date ']),
                applicationDate: cleanText(row['Date of Final Decsion ']),
                atJustification: cleanText(row['AT Justification']),
                linkToJudgment: cleanText(row['Link to Judgment/Order']),
                linkToSummary: cleanText(row['Link to Summary']),
                suitableForCaseStudy: cleanText(row['Suitable for Case Study?']),
                numberOfSubmission: cleanText(row['Number of submission '])
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
 * Normalizes ruling from "Who Lost?" field to standard ruling types
 * Note: "Who Lost?" has inverse logic - if Bank lost, ruling is in favor of Applicant
 */
const normalizeRulingFromWhoLost = (whoLost: string): RulingType => {
  if (!whoLost) {
    return 'Bank'; // Default
  }

  const normalized = whoLost.trim().toLowerCase();

  // If Bank lost, then Applicant won
  if (normalized === 'bank') {
    return 'Applicant';
  }

  // If Applicant lost, then Bank won
  if (normalized === 'applicant') {
    return 'Bank';
  }

  // Handle partial wins
  if (normalized.includes('partial') || normalized.includes('both')) {
    return 'Partially Applicant';
  }

  // Default to Bank
  return 'Bank';
};
