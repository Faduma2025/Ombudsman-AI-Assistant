/**
 * Text Utilities
 *
 * Text cleaning and normalization utilities
 * Migrated from src/services/csvParser.ts
 */

/**
 * Clean text by fixing encoding issues and normalizing whitespace
 *
 * Handles common encoding problems in tribunal documents:
 * - Smart quotes and apostrophes
 * - Em/en dashes
 * - BOM characters
 * - Extra whitespace
 */
export function cleanText(text: string): string {
  if (!text) return text;

  return text
    .replace(/�/g, "'")      // Replace � with apostrophe
    .replace(/â€™/g, "'")    // Replace smart apostrophe encoding issue
    .replace(/â€"/g, "–")    // Replace en-dash encoding issue
    .replace(/â€"/g, "—")    // Replace em-dash encoding issue
    .replace(/â€œ/g, '"')    // Replace opening quote encoding issue
    .replace(/â€/g, '"')     // Replace closing quote encoding issue
    .trim();
}

/**
 * Remove BOM (Byte Order Mark) from text
 */
export function removeBOM(text: string): string {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.substring(1);
  }
  return text;
}

/**
 * Normalize whitespace (collapse multiple spaces, trim)
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Estimate token count (rough approximation)
 * Assumes ~4 characters per token on average
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}
