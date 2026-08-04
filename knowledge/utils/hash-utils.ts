/**
 * Hash Utilities
 *
 * File hashing utilities for change detection
 */

import * as crypto from 'crypto';
import * as fs from 'fs/promises';

/**
 * Compute SHA-256 hash of a file
 *
 * Used for change detection - if file hash changes,
 * document needs to be reprocessed
 */
export async function computeFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

/**
 * Compute SHA-256 hash of a string
 */
export function computeStringHash(content: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

/**
 * Compare two hashes
 */
export function hashesEqual(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}
